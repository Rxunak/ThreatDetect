import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom"; // Needed for <Router>
import LogPage from "../../pages/LogPage";
import { act } from "react";
const mockDetectionData = [
  {
    _id: "1",
    getUserID: "user-123",
    itemDetected: "Weapon",
    confidenceScore: "85%",
    image: "https://example.com/weapon.jpg",
  },
  {
    _id: "2",
    getUserID: "user-456",
    itemDetected: "Knife",
    confidenceScore: "75%",
    image: "https://example.com/knife.jpg",
  },
];

const mockTextAnalysis = [
  {
    _id: "3",
    getUserID: "user-123",
    textAnalysed: "Hate Speech",
    analysis: [{ label: "Toxic" }],
  },
  { _id: "4", getUserID: "user-456", textAnalysed: "Neutral", analysis: [] },
];

const mockUsers = [
  {
    _id: "user1",
    username: "testUser1",
    email: "test1@example.com",
    isBlocked: false,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "user2",
    username: "testUser2",
    email: "test2@example.com",
    isBlocked: true,
    createdAt: "2023-01-02T00:00:00.000Z",
  },
];

jest.mock("../Navbar", () => () => <div data-testid="mock-navbar">Navbar</div>);

describe("Log Page Component", () => {
  let wrapper;

  beforeEach(async () => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/api/detections")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockDetectionData),
        });
      }
      if (url.includes("/api/analysis")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockTextAnalysis),
        });
      }
      if (url.includes("/api/users")) {
        return Promise.resolve({ json: () => Promise.resolve(mockUsers) });
      }
      return Promise.reject(new Error("Unknown API"));
    });

    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <LogPage />
        </MemoryRouter>
      );
    });

    wrapper.update();
  });

  afterEach(() => {
    jest.clearAllMocks();
    wrapper.unmount();
  });

  it("displays correct numbers on Admin Home Page", () => {
    expect(wrapper.find(".glanceTabs").at(0).text()).toBe("1");
    expect(wrapper.find(".glanceTabs").at(1).text()).toBe("1");
    expect(wrapper.find(".glanceTabs").at(2).text()).toBe("1");
    expect(wrapper.find(".glanceTabs").at(3).text()).toBe("1");
  });

  it("displays all details of blocked users correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(1).simulate("click");
    });
    wrapper.update();

    const blockedUsers = wrapper
      .find(".detectionListMain")
      .filterWhere((node) => node.text().includes("Confidence Score: 85%"));

    expect(blockedUsers.length).toBe(1);

    expect(blockedUsers.text()).toContain("user-123");

    const img = blockedUsers.find(".detectionText");
    expect(img.prop("src")).toBe("https://example.com/weapon.jpg");
  });

  it("displays all details of users pending review correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(1).simulate("click");
    });
    wrapper.update();

    const pendingUsers = wrapper
      .find(".detectionListMain")
      .filterWhere((node) => node.text().includes("Confidence Score: 75%"));

    expect(pendingUsers.length).toBe(1);

    expect(pendingUsers.text()).toContain("user-456");

    const img = pendingUsers.find(".detectionText");
    expect(img.prop("src")).toBe("https://example.com/knife.jpg");
  });

  it("deletes a blocked user correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(1).simulate("click");
    });
    wrapper.update();

    const deleteButton = wrapper
      .find(".detectionListMain")
      .at(0)
      .find(".buttonLog")
      .at(1);

    expect(deleteButton.exists()).toBe(true);

    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (url.includes(`/api/detections/1`) && options.method === "DELETE") {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("Delete API Failed"));
    });

    await act(async () => {
      deleteButton.simulate("click");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    wrapper.update();
    const remainingUsers = wrapper.find(".detectionListMain");
    console.log("Remaining Users After Deletion: ", remainingUsers.length);

    expect(remainingUsers.length).toBe(1);
    expect(remainingUsers.text()).not.toContain("user-123");
  });

  it("edits a blocked user's details correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(1).simulate("click");
    });
    wrapper.update();
    const editButton = wrapper
      .find(".detectionListMain")
      .at(0)
      .find(".buttonLog")
      .at(0);

    expect(editButton.exists()).toBe(true);
    await act(async () => {
      editButton.simulate("click");
    });
    wrapper.update();

    const itemInput = wrapper.find(".inputTextLabel").at(0);
    const confidenceInput = wrapper.find(".inputTextLabel").at(1);

    expect(itemInput.exists()).toBe(true);
    expect(confidenceInput.exists()).toBe(true);

    await act(async () => {
      itemInput.simulate("change", { target: { value: "Updated Weapon" } });
      confidenceInput.simulate("change", { target: { value: "90%" } });
    });
    wrapper.update();
    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (url.includes(`/api/detections/1`) && options.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              _id: "1",
              itemDetected: "Updated Weapon",
              confidenceScore: "90%",
              image: "https://example.com/weapon.jpg",
            }),
        });
      }
      return Promise.reject(new Error("Edit API Failed"));
    });

    await act(async () => {
      wrapper.find(".formSave").simulate("submit");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    wrapper.update();

    const updatedUser = wrapper.find(".detectionListMain").at(0);
    expect(updatedUser.text()).toContain("Updated Weapon");
    expect(updatedUser.text()).toContain("90%");
  });

  it("edits a review user's details correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(1).simulate("click");
    });
    wrapper.update();
    const editButton = wrapper
      .find(".detectionListMain")
      .at(1)
      .find(".buttonLog")
      .at(0);

    expect(editButton.exists()).toBe(true);

    await act(async () => {
      editButton.simulate("click");
    });
    wrapper.update();

    const itemInput = wrapper.find(".inputTextLabel").at(0);
    const confidenceInput = wrapper.find(".inputTextLabel").at(1);
    expect(itemInput.exists()).toBe(true);
    expect(confidenceInput.exists()).toBe(true);

    await act(async () => {
      itemInput.simulate("change", { target: { value: "Updated Knife" } });
      confidenceInput.simulate("change", { target: { value: "78%" } });
    });
    wrapper.update();

    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (url.includes(`/api/detections/2`) && options.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              _id: "2",
              itemDetected: "Updated Knife",
              confidenceScore: "78%",
              image: "https://example.com/knife.jpg",
            }),
        });
      }
      return Promise.reject(new Error("Edit API Failed"));
    });

    await act(async () => {
      wrapper.find(".formSave").simulate("submit");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    wrapper.update();

    const updatedUser = wrapper.find(".detectionListMain").at(1);
    expect(updatedUser.text()).toContain("Updated Knife");
    expect(updatedUser.text()).toContain("78%");
  });

  it("displays all details of blocked text correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(2).simulate("click");
    });
    wrapper.update();

    const blockedTextItems = wrapper.find(".detectionListMain");

    expect(blockedTextItems.length).toBe(1);

    const blockedText = blockedTextItems.at(0);

    expect(blockedText.text().replace(/\s+/g, " ")).toContain(
      "User Id: user-123"
    );
    expect(blockedText.text()).toContain("Detected Text: Hate Speech");
    expect(blockedText.text()).toContain("Threat Category: Toxic");
  });

  it("deletes a blocked text entry correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(2).simulate("click");
    });
    wrapper.update();

    let blockedTextEntry = wrapper.find(".detectionListMain").at(0);
    const deleteButton = blockedTextEntry.find(".buttonLog").at(1);

    expect(deleteButton.exists()).toBe(true);

    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (url.includes(`/api/analysis/3`) && options.method === "DELETE") {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("Delete API Failed"));
    });

    await act(async () => {
      deleteButton.simulate("click");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    wrapper.update();

    const remainingTextEntries = wrapper.find(".detectionListMain");
    console.log(
      "Remaining Text Entries After Deletion: ",
      remainingTextEntries.length
    );

    expect(remainingTextEntries.length).toBe(0);
  });

  it("edits a blocked text entry correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(2).simulate("click");
    });
    wrapper.update();

    const editButton = wrapper
      .find(".detectionListMain")
      .at(0)
      .find(".buttonLog")
      .at(0);

    expect(editButton.exists()).toBe(true);

    await act(async () => {
      editButton.simulate("click");
    });
    wrapper.update();

    const textInput = wrapper.find(".inputTextLabel").at(0);

    expect(textInput.exists()).toBe(true);

    await act(async () => {
      textInput.simulate("change", {
        target: { value: "Updated Hate Speech" },
      });
    });
    wrapper.update();

    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (url.includes(`/api/analysis/3`) && options.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              _id: "3",
              getUserID: "user-123",
              textAnalysed: "Updated Hate Speech",
              analysis: [{ label: "Toxic" }],
            }),
        });
      }
      return Promise.reject(new Error("Edit API Failed"));
    });

    await act(async () => {
      wrapper.find(".formSave").simulate("submit");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    wrapper.update();

    const updatedTextEntry = wrapper.find(".detectionListMain").at(0);
    expect(updatedTextEntry.text()).toContain("Updated Hate Speech");
  });

  it("displays all users correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(3).simulate("click");
    });
    wrapper.update();

    const usersList = wrapper.find(".userEachList");

    console.log("Users found in UI:", usersList.length);

    expect(usersList.length).toBe(mockUsers.length);

    usersList.forEach((node, index) => {
      expect(node.text()).toContain(mockUsers[index].username);
      expect(node.text()).toContain(mockUsers[index]._id);
    });
  });

  it("deletes a user correctly", async () => {
    await act(async () => {
      wrapper.find(".sidebar-bar").at(3).simulate("click"); // Navigate to Users section
    });
    wrapper.update();

    let userToDelete = wrapper.find(".userEachList").at(0);

    expect(userToDelete.exists()).toBe(true);

    let deleteButton = userToDelete.find(".userButton").at(1);
    expect(deleteButton.text()).toBe("Remove");

    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      if (
        url.includes(`/api/users/${mockUsers[0]._id}`) &&
        options.method === "DELETE"
      ) {
        mockUsers.shift();
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("Delete API Failed"));
    });

    await act(async () => {
      deleteButton.simulate("click");
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      wrapper.update();
    });

    const updatedUserList = wrapper.find(".userEachList");

    expect(updatedUserList.length).toBe(mockUsers.length);
  });
});
