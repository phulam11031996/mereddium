/**
 * Feature: Login API Testing
 *  As an API client I want to be able to send a user object to be added to
 *  the database.
 *
 * Scenario: Successfully login
 *    GIVEN My login information object has valid fields (email and password)
 *    WHEN I attempt to login with the user obj
 *    THEN I receive a successfull response (code 200)
 *    AND the response object contains the property token, firstName, lastName, email, password_bcrypt
 *
 * Scenario: Incorrect credential
 *    GIVEN My login information object has invalid fields (email or password)
 *    WHEN I attempt to login with the user obj
 *    THEN I receive a failure response (code 401)
 *    AND I should get a message of Invalid credentials, could not log you in
 */

describe("Login API Testing", () => {
  context("Successfully login", () => {
    before(() => {});

    let loginInfo = {};

    it("GIVEN My login information object has valid fields (email and password)", () => {
      loginInfo = {
        email: "yerbamate@gmail.com",
        password: "password",
      };
    });

    it("WHEN I attempt to login with the user obj", () => {
      cy.request("POST", "http://localhost:3030/auth/login", loginInfo).then(
        (response) => {
          expect(response.status).to.equal(200);
          expect(response.body.data.token).to.be.a("string"); // property token
          expect(response.body.data.user.firstName).to.be.a("string"); // property firstName
          expect(response.body.data.user.lastName).to.be.a("string"); // property lastName
          expect(response.body.data.user.password_bcrypt).to.be.a("string"); // property lastName
          expect(response.body.data.user.email).to.equal("yerbamate@gmail.com"); // property email
        }
      );
    });

    context("Incorrect credential", () => {
      before(() => {});

      let invalidLoginInfor;

      it("GIVEN My login information object has invalid fields (email or password)", () => {
        invalidLoginInfor = {
          email: "nonexist@gmail.com",
          password: "nonexist",
        };
      });

      it("WHEN I attempt to login with the user obj", () => {
        cy.request({
          method: "POST",
          url: "http://localhost:3030/auth/login",
          body: invalidLoginInfor,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(401); // status code
          expect(response.body.message).to.equal(
            // message
            "Invalid credentials, could not log you in."
          );
        });
      });
    });
  });
});
