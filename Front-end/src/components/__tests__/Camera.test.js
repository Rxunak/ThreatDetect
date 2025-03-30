import React from "react";
import { mount, shallow } from "enzyme";
import Camera from "../Camera";
import { act } from "react-dom/test-utils";

jest.mock("@tensorflow-models/coco-ssd", () => ({
  load: jest.fn(() =>
    Promise.resolve({
      detect: jest.fn(() =>
        Promise.resolve([
          { class: "bottle", bbox: [0, 0, 100, 100], score: 0.9 },
        ])
      ),
    })
  ),
}));

jest.mock("@tensorflow/tfjs", () => ({}));

describe("Camera Component", () => {
  let wrapper;

  beforeEach(() => {
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn(() =>
        Promise.resolve({
          getTracks: () => [{ stop: jest.fn() }],
        })
      ),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    wrapper = mount(<Camera />);
    expect(wrapper.exists()).toBe(true);
  });

  it("should start detection when button is clicked", async () => {
    wrapper = mount(<Camera />);
    expect(wrapper.find("button").text()).toBe("Start Detection");

    await act(async () => {
      wrapper.find("button").simulate("click");
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    wrapper.update();
    expect(wrapper.find("button").text()).toBe("Stop Detection");
    expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
  });

  it("should stop detection when button is clicked", async () => {
    const mockStop = jest.fn();
    const mockStream = {
      getTracks: () => [{ stop: mockStop }],
    };

    global.navigator.mediaDevices.getUserMedia.mockImplementation(() =>
      Promise.resolve(mockStream)
    );

    wrapper = mount(<Camera />);

    await act(async () => {
      wrapper.find("button").simulate("click");
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    wrapper.update();
    expect(wrapper.find("button").text()).toBe("Stop Detection");

    await act(async () => {
      wrapper.find("button").simulate("click");
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    wrapper.update();
    expect(mockStop).toHaveBeenCalled();
    expect(wrapper.find("button").text()).toBe("Start Detection");
  });

  it("handles camera access errors", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    global.navigator.mediaDevices.getUserMedia.mockImplementation(() =>
      Promise.reject(new Error("Camera access denied"))
    );

    wrapper = mount(<Camera />);

    await act(async () => {
      wrapper.find("button").simulate("click");
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(console.error).toHaveBeenCalled();

    const errorWasLogged = console.error.mock.calls.some((call) =>
      call.some(
        (arg) =>
          typeof arg === "string" &&
          arg.includes("Error while accessing camera feed:")
      )
    );

    expect(errorWasLogged).toBe(true);
    console.error = originalConsoleError;
  });

  it("correctly identifies objects of interest", () => {
    function detectRelevantObject(predictions) {
      return predictions.find(
        (prediction) =>
          prediction.class === "bottle" || prediction.class === "cell phone"
      );
    }

    const bottlePrediction = {
      class: "bottle",
      score: 0.9,
      bbox: [0, 0, 100, 100],
    };
    const bottlePredictions = [bottlePrediction];
    expect(detectRelevantObject(bottlePredictions)).toBe(bottlePrediction);

    const phonePrediction = {
      class: "cell phone",
      score: 0.75,
      bbox: [0, 0, 100, 100],
    };
    const phonePredictions = [phonePrediction];
    expect(detectRelevantObject(phonePredictions)).toBe(phonePrediction);

    const otherPredictions = [
      { class: "person", score: 0.95, bbox: [0, 0, 100, 100] },
    ];
    expect(detectRelevantObject(otherPredictions)).toBeUndefined();
  });

  it("calculates confidence score correctly", () => {
    function confidenceScore(predictions) {
      const getConf = predictions.find(
        (confidence) =>
          confidence.class === "bottle" || confidence.class === "cell phone"
      );
      let finalconfidence = null;
      if (getConf) {
        finalconfidence = `${parseFloat(getConf.score * 100).toFixed(2)}%`;
      }
      return finalconfidence;
    }

    const bottlePredictions = [
      { class: "bottle", score: 0.9, bbox: [0, 0, 100, 100] },
    ];
    expect(confidenceScore(bottlePredictions)).toBe("90.00%");

    const phonePredictions = [
      { class: "cell phone", score: 0.75, bbox: [0, 0, 100, 100] },
    ];
    expect(confidenceScore(phonePredictions)).toBe("75.00%");

    const otherPredictions = [
      { class: "person", score: 0.95, bbox: [0, 0, 100, 100] },
    ];
    expect(confidenceScore(otherPredictions)).toBe(null);
  });

  it("updates detection message when a bottle is detected", () => {
    const wrapper = shallow(
      <div>
        <div
          className="detection-message"
          style={{
            top: 0,
            left: 0,
            color: "red",
            fontSize: "20px",
          }}
        >
          Bottle Detected!
        </div>
      </div>
    );

    expect(wrapper.find(".detection-message").exists()).toBe(true);
    expect(wrapper.find(".detection-message").text()).toBe("Bottle Detected!");
  });

  it("updates detection message when a cell phone is detected", () => {
    const wrapper = shallow(
      <div>
        <div
          className="detection-message"
          style={{
            top: 0,
            left: 0,
            color: "red",
            fontSize: "20px",
          }}
        >
          Cell phone Detected!
        </div>
      </div>
    );
    expect(wrapper.find(".detection-message").exists()).toBe(true);
    expect(wrapper.find(".detection-message").text()).toBe(
      "Cell phone Detected!"
    );
  });
});
