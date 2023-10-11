describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "John Doe",
      username: "jdoe",
      password: "12345",
    };
    const user2 = {
      name: "Stephen King",
      username: "king",
      password: "lovecraft",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.request("POST", "http://localhost:3003/api/users/", user2);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", () => {
    cy.get("#username");
    cy.get("#password");
    cy.get("#login-button");
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.get("#username").type("jdoe");
      cy.get("#password").type("12345");
      cy.get("#login-button").click();

      cy.contains("John Doe logged in");
    });

    it("fails with incorrect credentials", () => {
      cy.get("#username").type("fail");
      cy.get("#password").type("fail");
      cy.get("#login-button").click();

      cy.get("#notification")
        .and("have.css", "color")
        .should("equal", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", () => {
    beforeEach(() => {
      cy.get("#username").type("jdoe");
      cy.get("#password").type("12345");
      cy.get("#login-button").click();
    });

    it("A blog can be created", () => {
      cy.contains("new blog").click();

      cy.get("#title").type("Test title");
      cy.get("#author").type("Test author");
      cy.get("#url").type("Test url");

      cy.contains("create").click();

      cy.contains("Test title");
    });

    describe("And a blog exists", () => {
      beforeEach(() => {
        cy.contains("new blog").click();

        cy.get("#title").type("Test title");
        cy.get("#author").type("Test author");
        cy.get("#url").type("Test url");

        cy.contains("create").click();
        cy.wait(3000);
      });

      it("It can be liked", () => {
        cy.contains("show").click();
        cy.get("#like-button").click();
        cy.contains("likes 1");
      });

      it("Can be deleted by the creator", () => {
        cy.contains("show").click();
        cy.contains("remove").click();
        cy.wait(3000);
        cy.contains("Test title").should("not.exist");
      });

      it("Cannot be deleted by another user", () => {
        cy.contains("logout").click();
        cy.get("#username").type("king");
        cy.get("#password").type("lovecraft");
        cy.get("#login-button").click();

        cy.contains("show").click();
        cy.contains("remove").should("not.exist");
      });

      it("Should be displayed in the right order", () => {
        cy.wait(3000);
        cy.contains("new blog").click();

        cy.get("#title").type("Another test title");
        cy.get("#author").type("Another test author");
        cy.get("#url").type("Another test url");
        cy.contains("create").click();

        cy.wait(3000);
        cy.contains("Another test title").contains("show").click();
        cy.contains("Another test title").contains("like").click();

        cy.get(".blog").eq(0).should("contain", "Another test title");
        cy.get(".blog").eq(1).should("contain", "Test title");
      });
    });
  });
});
