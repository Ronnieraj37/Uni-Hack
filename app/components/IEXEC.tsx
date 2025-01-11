import { IExecDataProtector } from "@iexec/dataprotector";
import { useState } from "react";
import "./App.css";
import loader from "./assets/loader.gif";
import successIcon from "./assets/success.png";
import { checkCurrentChain, checkIsConnected } from "./utils/utils";
import { getWalletClient } from "@wagmi/core";
import { config } from "../helpers/client";
const walletClient = await getWalletClient(config);
const iExecDataProtectorClient = new IExecDataProtector(walletClient);

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  // protectData()
  const [protectedDataAddress, setProtectedDataAddress] = useState("");
  const [isLoadingProtectData, setIsLoadingProtectData] = useState(false);
  const [protectDataSuccess, setProtectDataSuccess] = useState(false);

  // createCollection()
  const [collectionIdInput, setCollectionIdInput] = useState("");
  const [isLoadingCreateCollection, setIsLoadingCreateCollection] =
    useState(false);
  const [createCollectionSuccess, setCreateCollectionSuccess] = useState(false);

  // addToCollection()
  const [
    isLoadingAddProtectedDataToCollection,
    setIsLoadingAddProtectedDataToCollection,
  ] = useState(false);
  const [
    addProtectedDataToCollectionSuccess,
    setAddProtectedDataToCollectionSuccess,
  ] = useState(false);

  // setProtectDataToRenting()
  const [protectedDataPriceInput, setProtectedDataPriceInput] = useState("");
  const [
    isLoadingSetProtectedDataToRenting,
    setIsLoadingSetProtectedDataToRenting,
  ] = useState(false);
  const [
    setProtectedDataToRentingSuccess,
    setSetProtectedDataToRentingSuccess,
  ] = useState(false);

  // rentProtectedData()
  const [isLoadingRentProtectedData, setIsLoadingRentProtectedData] =
    useState(false);
  const [isLoadingConsumeProtectedData, setIsLoadingConsumeProtectedData] =
    useState(false);
  const [rentProtectedDataSuccess, setRentProtectedDataSuccess] =
    useState(false);

  // consumeProtectedData()
  const [consumeProtectedDataSuccess, setConsumeProtectedDataSuccess] =
    useState(false);
  const [contentUrl, setContentUrl] = useState("");

  // getResultFromCompletedTask()
  const [taskId, setTaskId] = useState("");
  const [
    isLoadingGetResultFromCompletedTask,
    setIsLoadingGetResultFromCompletedTask,
  ] = useState(false);
  const [getResultFromCompletedTaskSuccess, setResultFromCompletedTaskSuccess] =
    useState(false);
  const [content, setContent] = useState("");

  const protectData = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setProtectDataSuccess(false);
      setIsLoadingProtectData(true); // Show loader
      const protectedDataResponse =
        await iExecDataProtectorClient.core.protectData({
          data: {
            // A binary "file" field must be used if you use the app provided by iExec
            file: new TextEncoder().encode(
              "DataProtector Sharing > Sandbox test!"
            ),
          },
          name: "DataProtector Sharing Sandbox - Test protected data",
        });
      console.log("protectedDataResponse", protectedDataResponse);

      setProtectedDataAddress(protectedDataResponse.address);
      setIsLoadingProtectData(false); // hide loader
      setProtectDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingProtectData(false); // hide loader
      console.error(e);
    }
  };

  const createCollection = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setCreateCollectionSuccess(false);
      setIsLoadingCreateCollection(true); // Show loader
      const createCollectionResponse =
        await iExecDataProtectorClient.sharing.createCollection();
      console.log("createCollectionResponse", createCollectionResponse);

      setCollectionIdInput(createCollectionResponse.collectionId.toString());
      setIsLoadingCreateCollection(false); // hide loader
      setCreateCollectionSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingCreateCollection(false); // hide loader
      console.error(e);
    }
  };

  const addToCollection = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setAddProtectedDataToCollectionSuccess(false);
      setIsLoadingAddProtectedDataToCollection(true); // Show loader
      const addToCollectionResult =
        await iExecDataProtectorClient.sharing.addToCollection({
          protectedData: protectedDataAddress,
          collectionId: +collectionIdInput,
          // Give a whitelist of apps allowed to consume this protected data
          // This whitelist is a smart contract managed by iExec Team
          addOnlyAppWhitelist: import.meta.env
            .VITE_PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
        });
      console.log("addToCollectionResult", addToCollectionResult);

      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      setAddProtectedDataToCollectionSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      console.error(e);
    }
  };

  const setProtectedDataToRenting = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setSetProtectedDataToRentingSuccess(false);
      setIsLoadingSetProtectedDataToRenting(true); // Show loader
      const setProtectedDataToRentingResult =
        await iExecDataProtectorClient.sharing.setProtectedDataToRenting({
          protectedData: protectedDataAddress,
          price: +protectedDataPriceInput,
          duration: 60 * 60 * 24 * 30, // 30 days
        });
      console.log(
        "setProtectedDataToRentingResult ",
        setProtectedDataToRentingResult
      );

      setIsLoadingSetProtectedDataToRenting(false); // hide loader
      setSetProtectedDataToRentingSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingSetProtectedDataToRenting(false); // hide loader
      console.error(e);
    }
  };

  const rentProtectedData = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setRentProtectedDataSuccess(false);
      setIsLoadingRentProtectedData(true); // Show loader
      const rentProtectedDataResult =
        await iExecDataProtectorClient.sharing.rentProtectedData({
          protectedData: protectedDataAddress,
          price: +protectedDataPriceInput,
          duration: 60 * 60 * 24 * 30,
        });
      console.log("rentProtectedDataResult", rentProtectedDataResult);

      setIsLoadingRentProtectedData(false); // hide loader
      setRentProtectedDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingRentProtectedData(false); // hide loader
      console.error(e);
    }
  };

  const consumeProtectedData = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setConsumeProtectedDataSuccess(false);
      setIsLoadingConsumeProtectedData(true); // Show loader
      const consumeProtectedDataResult =
        await iExecDataProtectorClient.sharing.consumeProtectedData({
          protectedData: protectedDataAddress,
          // app is part of the whitelist of apps defined in the addToCollection() call
          app: import.meta.env.VITE_PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
          // workerpool may be omitted to use the default production workerpool
          workerpool: import.meta.env.VITE_DEMO_WORKERPOOL_ADDRESS,
          onStatusUpdate: (status) => {
            console.log("[consumeProtectedData] status", status);
          },
        });
      console.log("consumeProtectedDataResult", consumeProtectedDataResult);
      setTaskId(consumeProtectedDataResult.taskId);

      // consumeProtectedDataResult.result is a Uint8Array containing:
      // - A "computed.json" file
      // - A "content" that is actually the protected content
      // (In this sandbox, the content is a string, so you can rename the file to "content.txt" and it will work)

      const contentAsBlob = new Blob([consumeProtectedDataResult.result]);
      const contentAsObjectUrl = URL.createObjectURL(contentAsBlob);
      setContentUrl(contentAsObjectUrl);
      setIsLoadingConsumeProtectedData(false); // hide loader
      setConsumeProtectedDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingConsumeProtectedData(false); // hide loader
      console.error(e);
    }
  };

  const getResultFromCompletedTask = async () => {
    setErrorMessage("");
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage("Please install MetaMask");
      return;
    }
    await checkCurrentChain();
    try {
      setResultFromCompletedTaskSuccess(false);
      setIsLoadingGetResultFromCompletedTask(true); // Show loader
      const taskResult =
        await iExecDataProtectorClient.sharing.getResultFromCompletedTask({
          taskId,
          // The consuming app provided by iExec will store its result in a file named "content"
          path: "content",
          onStatusUpdate: (status) => {
            console.log("[getResultFromCompletedTask] status", status);
          },
        });
      const decodedText = new TextDecoder().decode(taskResult.result);
      console.log("decodedText", decodedText);
      setContent(decodedText);
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      setResultFromCompletedTaskSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      console.error(e);
    }
  };

  const handleProtectedDataAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProtectedDataAddress(event.target.value);
  };

  const handleCollectionIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCollectionIdInput(event.target.value);
  };

  const handleProtectedDataPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProtectedDataPriceInput(event.target.value);
  };

  const handleTaskIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskId(event.target.value);
  };

  function download() {
    const element = document.createElement("a");
    element.setAttribute("href", contentUrl);
    element.setAttribute("download", "ProtectedDataFile.zip");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return (
    <>
      <div>
        <h2>Create Test Protected Data</h2>
        {isLoadingProtectData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={protectData}>Create Test Protected Data</button>
        )}
        {protectDataSuccess && (
          <div style={{ marginTop: "4px" }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: "middle" }}
            />
            Successful creation
          </div>
        )}
        {errorMessage && (
          <div style={{ marginTop: "10px", maxWidth: 300, color: "red" }}>
            {errorMessage}
          </div>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <h2>Create Collection</h2>
        {isLoadingCreateCollection ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={createCollection}>Create Collection</button>
        )}
        {createCollectionSuccess && (
          <div>
            <div style={{ marginTop: "4px" }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: "middle" }}
              />
              Successful creation
            </div>
          </div>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <h2>Add Protected Data To Collection</h2>
        <div>
          <label>
            Protected Data Address:{" "}
            <input
              name="Protected Data Address"
              value={protectedDataAddress}
              style={{ width: "350px" }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        <div>
          <label>
            Collection Id:{" "}
            <input
              name="Collection Id"
              value={collectionIdInput}
              onChange={handleCollectionIdChange}
            />
          </label>
        </div>
        {isLoadingAddProtectedDataToCollection ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={addToCollection}>
            Add Protected Data To Collection
          </button>
        )}
        {addProtectedDataToCollectionSuccess && (
          <div style={{ marginTop: "4px" }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: "middle" }}
            />
            Protected Data Added to Collection
          </div>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <div>
          <h2>Set Protected Data For Renting</h2>
          <label>
            Protected Data Address:{" "}
            <input
              name="Protected Data Address"
              value={protectedDataAddress}
              style={{ width: "350px" }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        <div>
          <label>
            Price of Protected Data:{" "}
            <input
              name="Protected Data Price"
              defaultValue="0"
              onChange={handleProtectedDataPriceChange}
            />
          </label>
        </div>
        {isLoadingSetProtectedDataToRenting ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={setProtectedDataToRenting}>
            Set Protected Data for Renting
          </button>
        )}
        {setProtectedDataToRentingSuccess && (
          <div style={{ marginTop: "4px" }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: "middle" }}
            />
            Protected Data Set for Renting
          </div>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <h2>Rent Protected Data</h2>
        <div
          style={{
            marginTop: "-20px",
            marginBottom: "20px",
            fontStyle: "italic",
          }}
        >
          Rent your own protected data
        </div>
        <div>
          <label>
            Protected Data Address:{" "}
            <input
              name="Protected Data Address"
              value={protectedDataAddress}
              style={{ width: "350px" }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        {isLoadingRentProtectedData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={rentProtectedData}>Rent Protected Data</button>
        )}
        {rentProtectedDataSuccess && (
          <div style={{ marginTop: "4px" }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: "middle" }}
            />
            You are Now Renting The Protected Data
          </div>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <h2>Consume Protected Data</h2>
        <div
          style={{
            marginTop: "-20px",
            marginBottom: "20px",
            fontStyle: "italic",
          }}
        >
          Consume your own protected data
        </div>
        <div>
          <label>
            Protected Data Address:{" "}
            <input
              name="Protected Data Address"
              value={protectedDataAddress}
              style={{ width: "350px" }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        {isLoadingConsumeProtectedData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={consumeProtectedData}>Consume Protected Data</button>
        )}
        {consumeProtectedDataSuccess && (
          <>
            <div style={{ marginTop: "4px" }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: "middle" }}
              />
              You can now visualize the rented Protected Data:{" "}
              <button
                type="button"
                onClick={() => {
                  download();
                }}
              >
                Download File
              </button>
            </div>
            <div>
              The zip file contains a "content" file. The protected data is a
              text so you can safely{" "}
              <strong>rename the file to "content.txt"</strong>.
            </div>
          </>
        )}
        <hr style={{ marginTop: "30px" }} />
      </div>

      <div>
        <h3>Or if you have a completed Task ID</h3>
        <div>
          <label>
            Completed Task ID:{" "}
            <input
              name="Completed Task ID"
              value={taskId}
              style={{ width: "500px" }}
              onChange={handleTaskIdChange}
            />
          </label>
        </div>
        <div style={{ marginTop: "4px" }}>
          {isLoadingGetResultFromCompletedTask ? (
            <img src={loader} alt="loading" height="30px" />
          ) : (
            <button onClick={getResultFromCompletedTask}>
              Get Result From Completed Task
            </button>
          )}
        </div>
        {getResultFromCompletedTaskSuccess && (
          <div>
            <div style={{ marginTop: "4px" }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: "middle" }}
              />
              The content of the rented Protected Data is:{" "}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: "4px",
                border: "1px solid blue",
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              {content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
