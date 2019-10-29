describe('configuring telegraf', () => {
  beforeEach(() => {
    cy.flush()

    cy.signin().then(({body}) => {
      cy.wrap(body.org).as('org')
    })

    cy.fixture('routes').then(({orgs}) => {
      cy.get('@org').then(({id: orgID}: Organization) => {
        cy.visit(`${orgs}/${orgID}/load-data/telegrafs`)
      })
    })
  })

  // fix for thttps://github.com/influxdata/influxdb/issues/15500
  describe('configuring nginx', () => {
    beforeEach(() => {
      cy.contains('Create Configuration').click()
      cy.contains('NGINX').click()
      cy.contains('Continue').click()
      cy.contains('nginx').click()
    })

    it('can add a single url', () => {
      cy.getByTestID('input-field').type('http://localhost:9999')
      cy.contains('Add').click()

      cy.contains('http://localhost:9999').should('exist')

      cy.contains('Done').click()
      cy.get('.icon.checkmark').should('exist')
    })

    it('can add multiple urls', () => {
      cy.getByTestID('input-field').type('http://localhost:9999')
      cy.contains('Add').click()
      cy.getByTestID('input-field').type('http://example.com')
      cy.contains('Add').click()

      cy.contains('http://localhost:9999').should('exist')
      cy.contains('http://example.com').should('exist')

      cy.contains('Done').click()
      cy.get('.icon.checkmark').should('exist')
    })

    it('can delete a url', () => {
      cy.getByTestID('input-field').type('http://localhost:9999')
      cy.contains('Add').click()

      cy.contains('http://localhost:9999').should('exist')

      // couldn't get these contains calls to work without waiting a little bit ¯\_(ツ)_/¯
      cy.wait(100)
      cy.contains('Delete').click()

      cy.wait(100)
      cy.contains('Confirm').click()

      cy.contains('http://localhost:9999').should('not.exist')
    })

    it("shows an indicator when the configuration doesn't work", () => {
      cy.getByTestID('input-field').type('youre mom')
      cy.contains('Add').click()

      cy.contains('youre mom').should('exist')

      cy.contains('Done').click()
      cy.get('.icon.remove').should('exist')
    })

    it('does nothing when clicking done with no urls', () => {
      cy.contains('Done').click()
      cy.contains('Done').should('exist')
      cy.contains('Nginx').should('exist')
    })
  })
})
