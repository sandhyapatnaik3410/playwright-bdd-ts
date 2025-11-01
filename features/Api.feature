Feature: Authentication API

  @API
  Scenario: Validate login token generation
    Given I authenticate at the Authentication endpoint with username "sandhyarani.p413@gmail.com" and password "C@rby3410"
    Then the authentication response status should be 200
    And the response should contain a token
    Then navigate to learning instance under AI tab
    Then I create learning instance
    And I verify the learning instance is created successfully