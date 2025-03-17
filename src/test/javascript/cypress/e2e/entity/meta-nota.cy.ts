import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('MetaNota e2e test', () => {
  const metaNotaPageUrl = '/meta-nota';
  const metaNotaPageUrlPattern = new RegExp('/meta-nota(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const metaNotaSample = { area: 'since', meta: 802 };

  let metaNota;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/meta-notas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/meta-notas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/meta-notas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (metaNota) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/meta-notas/${metaNota.id}`,
      }).then(() => {
        metaNota = undefined;
      });
    }
  });

  it('MetaNotas menu should load MetaNotas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('meta-nota');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MetaNota').should('exist');
    cy.url().should('match', metaNotaPageUrlPattern);
  });

  describe('MetaNota page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(metaNotaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MetaNota page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/meta-nota/new$'));
        cy.getEntityCreateUpdateHeading('MetaNota');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaNotaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/meta-notas',
          body: metaNotaSample,
        }).then(({ body }) => {
          metaNota = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/meta-notas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/meta-notas?page=0&size=20>; rel="last",<http://localhost/api/meta-notas?page=0&size=20>; rel="first"',
              },
              body: [metaNota],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(metaNotaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MetaNota page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('metaNota');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaNotaPageUrlPattern);
      });

      it('edit button click should load edit MetaNota page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MetaNota');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaNotaPageUrlPattern);
      });

      it('edit button click should load edit MetaNota page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MetaNota');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaNotaPageUrlPattern);
      });

      it('last delete button click should delete instance of MetaNota', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('metaNota').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', metaNotaPageUrlPattern);

        metaNota = undefined;
      });
    });
  });

  describe('new MetaNota page', () => {
    beforeEach(() => {
      cy.visit(`${metaNotaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MetaNota');
    });

    it('should create an instance of MetaNota', () => {
      cy.get(`[data-cy="area"]`).type('season banish');
      cy.get(`[data-cy="area"]`).should('have.value', 'season banish');

      cy.get(`[data-cy="meta"]`).type('415');
      cy.get(`[data-cy="meta"]`).should('have.value', '415');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        metaNota = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', metaNotaPageUrlPattern);
    });
  });
});
