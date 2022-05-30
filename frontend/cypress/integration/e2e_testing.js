// Feature: Sign up
// As a user, I want to sign up to the website so I can access
// features that only registered users can access, such as commenting,
// publishing posts, up voting, etc.

// Scenario 1: Successful sign up
// I sign up with valid email (not contained in the database) and password
// Given I chose to sign up
// And I fill out my first name, last name, email, and password
// When I click the submit button
// Then I get redirected to the website
// And I am logged into my new account

// Scenario 2: Duplicate email
// I sign up with an email that is already taken
// Given I chose to sign up
// And I fill out my first name, last name, email, and password
// When I click the submit button
// Then I get an alert that my email is invalid/taken

describe("Sign up", () => {
  const firstName = "Yerba";
  const lastName = "Mate";
  const email = (Math.random() + 1).toString(36).substring(7) + "@gmail.com";
  const password = "password";
  const password_confirm = "password";
  context(
    // Scenario 1
    "Successful sign up - I sign up with valid email (not contained in the database) and password",
    () => {
      it("GIVE I chose to sign up", () => {
        cy.visit("http://localhost:3000/signup");
      });

      it("AND I enter first name, last name, email address, password, confirm pass word, and submit the form", () => {
        cy.intercept("POST", "http://localhost:3000/auth/signup").as("signup");
        cy.get("form").within(() => {
          cy.get('input[name="firstName"]').type(firstName);
          cy.get('input[name="lastName"]').type(lastName);
          cy.get('input[name="email"]').type(email);
          cy.get('input[name="password"]').type(password);
          cy.get('input[name="password_confirm"]').type(password_confirm);
        });
      });

      it("WHEN I click the submit button", () => {
        cy.get("form").within(() => {
          cy.get('button[name="submit"]').click();
        });
      });

      it("THEN I get redirected to the website AND I am logged into my noew account", () => {
        cy.url().should("eq", "http://localhost:3000/");
      });
    }
  );

  context("Duplicate Email", () => {
    // Screnario 2
    context("I signup with an email that is already taken", () => {
      it("GIVE I chose to sign up", () => {
        cy.visit("http://localhost:3000/signup");
      });

      it("AND I enter first name, last name, email address, password, confirm pass word, and submit the form", () => {
        cy.intercept("POST", "http://localhost:3000/auth/signup").as("signup");
        cy.get("form").within(() => {
          cy.get('input[name="firstName"]').type(firstName);
          cy.get('input[name="lastName"]').type(lastName);
          cy.get('input[name="email"]').type(email);
          cy.get('input[name="password"]').type(password);
          cy.get('input[name="password_confirm"]').type(password_confirm);
        });
      });

      it("WHEN I click the submit button", () => {
        cy.get("form").within(() => {
          cy.get('button[name="submit"]').click();
        });
      });

      it("THEN I get an alert that my email is invalid/taken", () => {
        cy.get('[name="error_message"]').contains(
          "User exists already, please login instead."
        );
      });
    });
  });
});
