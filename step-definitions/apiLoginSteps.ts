import { Given, When, Then } from "@cucumber/cucumber";
import { expect, request } from "@playwright/test";
import { Login } from "../Model/Request/login";
import { getPayload } from "../utils/payloadReader";
import { LearningInstance } from "../Model/Request/learningInstance";
import { LearningInstanceListModel } from "../Model/Request/learningInstanceList";
import generateUniqueName from "../utils/apiHelper";

let learningInstanceName = "";
//const AUTH_URL = "https://community.cloud.automationanywhere.digital/v2/authentication";

Given(
  'I authenticate at the Authentication endpoint with username {string} and password {string}',
  async function (username: string, password: string) {
    // Load login payload from JSON file
    const jsonData = getPayload<Login>("login");
    const payload = Login.fromJson(jsonData);

    // Override credentials from step if provided
    payload.username = username;
    payload.password = password;

    // Initialize Playwright API context
    const apiContext = await request.newContext({
      baseURL: "https://community.cloud.automationanywhere.digital",
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });

    // Perform POST call
    const response = await apiContext.post("/v2/authentication", { data: payload });

    // Validate response
    expect(response.status()).toBe(200);
    const body = await response.json();
    //console.log("🔐 Auth Response:", body);
    this.lastResponse = { status: response.status(), body: body };

    // Validate token
    expect(body).toHaveProperty("token");
    expect(body.token).not.toBe("");

    // Save token in scenario context
    (this as any).token = body.token;
    console.log("Token received:", body.token);

    await apiContext.dispose();
  }
);

Then('the authentication response status should be {int}', function (expectedStatus: number) {
  expect(this.lastResponse?.status).toBe(expectedStatus);
});

Then('the response should contain a token', function () {
  const token = this.lastResponse?.body?.token;
  expect(token).toBeTruthy();
  expect(typeof token).toBe("string");
  expect(token.length).toBeGreaterThan(10);
});

Then("navigate to learning instance under AI tab", async function () {
  // Load payload from JSON
  const jsonData = getPayload<LearningInstance>("learningInstanceList");
  const payload = LearningInstanceListModel.fromJson(jsonData);

  // Initialize Playwright API context
  const apiContext = await request.newContext({
    baseURL: "https://community.cloud.automationanywhere.digital",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "x-authorization": `${(this as any).token}`, // Token stored in scenario context from login step
    },
  });

  const response = await apiContext.post("/cognitive/v3/learninginstances/list", { data: payload });

  expect(response.status()).toBe(200);
  console.log("Navigated to Learning Instance under AI tab successfully.");
  await apiContext.dispose();
});

Then(
  "I create learning instance",
  async function () {
    // Load learningInstance payload from JSON
    const jsonData = getPayload<LearningInstance>("learningInstance");
    // clone to avoid mutating source
    const payload: LearningInstance = JSON.parse(JSON.stringify(jsonData));

    // Override payload fields using parameters from feature step
    learningInstanceName = generateUniqueName("Learning_Instance");
    console.log("Creating Learning Instance with name:", learningInstanceName);
    payload.name = learningInstanceName;
    payload.description = "Learning description";

    // Initialize Playwright API context
    const apiContext = await request.newContext({
      baseURL: "https://community.cloud.automationanywhere.digital",
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        "x-authorization": `${(this as any).token}`,
      },
    });

    const response = await apiContext.post("/cognitive/v3/learninginstances", { data: payload });
    expect(response.status()).toBe(200);

    await apiContext.dispose();
  }
);

Then("I verify the learning instance is created successfully", async function () {
  // Load payload from JSON
  const jsonData = getPayload<LearningInstance>("learningInstanceList");
  const payload = LearningInstanceListModel.fromJson(jsonData);

  // Initialize Playwright API context
  const apiContext = await request.newContext({
    baseURL: "https://community.cloud.automationanywhere.digital",
    extraHTTPHeaders: {
      "Content-Type": "application/json", 
      "x-authorization": `${(this as any).token}`,
    },
  });

  const response = await apiContext.post("/cognitive/v3/learninginstances/list", { data: payload });

  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(body.list.some((item: {name: string}) => item.name === learningInstanceName)).toBe(true);
  console.log(`Learning Instance ${learningInstanceName} verified successfully after creation.`);

  await apiContext.dispose();
});

