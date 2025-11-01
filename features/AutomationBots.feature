Feature: Login functionality

  Background: Prerequisite
    When I navigate to a url
    Given the user is logged into the Automation Anywhere application
    When the user navigates to the "Automation" workspace
    When the user opens the Create dropdown

  @UI
  Scenario: Create a new Task Bot and configure Message Box action successfully
    And the user selects "Task Bot" from the creation options
    And verify the "Task Bot" creation pop up is displayed
    And provides all mandatory Task Bot details
    And submits the Task Bot creation form
    Then Verify the Task Bot is created successfully
    Then the Task Bot workspace should be displayed
    When the user searches for the "Message box" action in the Actions panel
    And adds the "Message box" action to the Task Bot
    Then the "Message box" configuration panel should appear on the right side
    # When the user validates all UI elements in the configuration panel
    When the user validates all UI elements in the configuration panel:
      | Enter the message box window title |
      | Enter the message to display       |
      | Scrollbar after lines              |
    When user enters the Display Message name
    And saves the Message Box configuration
    Then the Task Bot should be visible in the Automation Bot page

  @UI
  Scenario: Create a new Form and configure Message Box action successfully
    And the user selects "Form" from the creation options
    And verify the "Form" creation pop up is displayed
    And provides all mandatory Form details
    And submits the Form creation form
    Then Verify the Form is created successfully
    Then I drag and drop "Text Box" onto the canvas
    Then I drag and drop "Select File" onto the canvas
    Then I click on Textbox and verify all UI elements in the configuration panel
    Then I click on Select File and verify all UI elements in the configuration panel
    And enter Textbox name
    # Then upload a document in Select File
    And saves the Form configuration
    Then the Form should be visible in the Automation Bot page
# And I verify the file is uploaded successfully
