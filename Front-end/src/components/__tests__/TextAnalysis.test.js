import React from "react";
import { mount } from "enzyme";
import { act } from "react";
import TextAnalysis from "../TextAnalysis";


jest.mock("@tensorflow-models/toxicity", () => ({
    load: jest.fn(() =>
      Promise.resolve({
        classify: jest.fn(() =>
          Promise.resolve([
            {
              label: "toxicity",
              results: [{ match: true, probabilities: [0.1, 0.9] }],
            },
            {
              label: "obscene",
              results: [{ match: true, probabilities: [0.2, 0.8] }],
            },
            {
              label: "insult",
              results: [{ match: true, probabilities: [0.3, 0.7] }],
            },
          ])
        ),
      })
    ),
  }));

jest.mock("@tensorflow/tfjs", () => ({}));

jest.mock("../Camera", () => {
  return function DummyCamera() {
    return <div data-testid="mock-camera">Camera Component</div>;
  };
});

describe("TextAnalysis", () => {
  let wrapper;
  let setChatHistorySpy;
  

  beforeEach(async () => {
    setChatHistorySpy = jest.fn(); 
    
    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify({ userId: "test-user" })),
      setItem: jest.fn(),
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    delete window.location;
    window.location = { href: "" };

    global.alert = jest.fn();

    await act(async () => {
        wrapper = mount(<TextAnalysis />);
      });
      wrapper.update();
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
  });

  it("renders the component without crashing", async () => {
    await act(async () => {
      wrapper = mount(<TextAnalysis />);
    });
    wrapper.update();
    expect(wrapper.exists()).toBe(true);
  });

  it("renders input field and buttons", async () => {
    await act(async () => {
      wrapper = mount(<TextAnalysis />);
    });
    wrapper.update();

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find(".cameraIcon").exists()).toBe(true);
    expect(wrapper.find(".sendIcon").exists()).toBe(true);
  });

  it("updates input value when typing", async () => {
    await act(async () => {
      wrapper = mount(<TextAnalysis />);
    });
    wrapper.update();

    const input = wrapper.find("input");

    act(() => {
      input.simulate("change", { target: { value: "Hello Raunak" } });
    });

    wrapper.update();
    expect(wrapper.find("input").prop("value")).toBe("Hello Raunak");
  });

  it("opens camera component when camera icon is clicked", async () => {
    await act(async () => {
      wrapper = mount(<TextAnalysis />);
    });
    wrapper.update();

    const cameraButton = wrapper.find(".cameraIcon");
    expect(wrapper.find(".modalOverlay").exists()).toBe(false);

    act(() => {
      cameraButton.simulate("click");
    });

    wrapper.update();
    expect(wrapper.find(".modalOverlay").exists()).toBe(true);
  });

  it("closes camera component when close button is clicked", async () => {
    await act(async () => {
      wrapper = mount(<TextAnalysis />);
    });
    wrapper.update();

    act(() => {
      wrapper.find(".cameraIcon").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find(".modalOverlay").exists()).toBe(true);

    act(() => {
      wrapper.find(".closeButton").simulate("click");
    });
    wrapper.update();
    expect(wrapper.find(".modalOverlay").exists()).toBe(false);
  });
});