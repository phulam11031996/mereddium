/**
 * Feature: GET all the post from back end
 * Scenario:
 *    GIVEN I run the backend
 *    WHEN I visit the root endpoint http://localhost:3030/post/
 *    THEN I get an array of posts
 *    AND the response code is 200
 */
describe("GET all the post from back end", () => {
  context("GET all the post from backend", () => {
    before(() => {});

    it("GIVEN I run the backend", () => {});

    it("WHEN I visit the root endpoint http://localhost:3030/post", () => {
      cy.request("http://localhost:3030/post/").then((response) => {
        expect(response.status).to.equal(200); // AND the response code is 200
        expect(response.body.data).to.be.a("array"); // THEN I get an array of posts
        console.log(response.body.data);
        if (response.body.data[0]._id) {
          expect(response.body.data[0].title).to.be.a("string");
          expect(response.body.data[0].message).to.be.a("string");
          expect(response.body.data[0].imageURL).to.be.a("string");
          expect(response.body.data[0].comments).to.be.a("array");
        }
      });
    });
  });
});
