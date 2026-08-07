describe('Browse -> Property detail -> Contact flow', () => {
  it('loads properties, opens detail and reveals contact', () => {
    // Intercept properties list
    cy.intercept('GET', '**/properties', { fixture: 'property-list.json' }).as('getProperties');
    // Intercept property detail
    cy.intercept('GET', '**/properties/p1', { fixture: 'property-detail.json' }).as('getProperty');
    // Intercept contact reveal
    cy.intercept('GET', '**/categories/c1/contact', {
      statusCode: 200,
      body: {
        unit_id: 'c1',
        property_name: 'Cypress Test Property',
        unit_label: '1BR',
        landlord_phone: '+254700000000',
        landlord_email: 'agent@demo.com',
        landlord_profile: { id: 'l1', user_id: 'u1', national_id_number: '1234', is_caretaker: false, verification_status: 'verified', created_at: '2024-01-01T00:00:00.000Z' }
      }
    }).as('getContact');

    // Visit browse page
    cy.visit('/properties');
    cy.wait('@getProperties');

    // Should show the test property
    cy.contains('Cypress Test Property').should('be.visible');

    // Click property link
    cy.contains('Cypress Test Property').click();
    cy.wait('@getProperty');

    // On detail page, open contact for the unit
    cy.contains('Contact property manager').click();

    // The modal should appear with phone number
    cy.wait('@getContact');
    cy.contains('+254700000000').should('be.visible');
  });
});
