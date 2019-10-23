package influxdb

import (
	"context"
	"errors"
	"time"
)

// FindTasksService implements the FindTasks method of a TaskService for the TaskHealthService to use
type FindTasksService interface {
	FindTasks(ctx context.Context, filter TaskFilter) ([]*Task, int, error)
}

// TaskHealthService is responsible for monitoring the latency of active tasks in the kv store
type TaskHealthService struct {
	fts           FindTasksService
	pollingPeriod time.Duration
	ctx           context.Context
	cancel        context.CancelFunc
}

// NewTaskHealthService takes a TaskHealthService and creates a new TaskHealthService
func NewTaskHealthService(ctx context.Context, fts FindTasksService, p time.Duration) *TaskHealthService {
	ctxWithCancel, cancel := context.WithCancel(ctx)

	return &TaskHealthService{
		fts:           fts,
		ctx:           ctxWithCancel,
		cancel:        cancel,
		pollingPeriod: p,
	}
}

func (p *TaskHealthService) Open() {
	ticker := time.NewTicker(p.pollingPeriod)

	go func() {
		for {
			select {
			case <-ticker.C:
				p.PollActiveTasks()
			case <-p.ctx.Done():
				ticker.Stop()
				return
			}
		}
	}()
}

func (p *TaskHealthService) Close() {
	p.cancel()
}

// PollActiveTasks checks the KV store for Active Tasks on a regular interval scheduled by pollingPeriod
func (p *TaskHealthService) PollActiveTasks() ([]*Task, error) {
	active := true
	filter := TaskFilter{Active: &active}

	tasks, _, err := p.fts.FindTasks(p.ctx, filter)
	if err != nil {
		return nil, errors.New("TaskHealthService could not find tasks")
	}

	return tasks, nil
}
