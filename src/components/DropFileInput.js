// import React, { useEffect, useState } from "react";
// import { InboxOutlined, DeleteOutlined, FileOutlined, EyeOutlined } from "@ant-design/icons";
// import { message, Upload, Progress, Button, Form, Alert, List, Tooltip } from "antd";
// import axios from "axios";
// import { getToken } from "../../config/Constant";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";

// const { Dragger } = Upload;
// const MySwal = withReactContent(Swal);

// const DropFileInput = ({ fileList, setFileList, validateField, uploadedFiles, setUploadedFiles, fileError, setFileError, resetUploadFiles }) => {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [uploadedFileObjects, setUploadedFileObjects] = useState([]);

//   useEffect(() => {
//     if (resetUploadFiles) {
//       setUploadedFiles([]);
//       setUploadedFileObjects([]);
//     }
//   }, [resetUploadFiles]);

//   const handleUpload = () => {
//     if (!validateField()) {
//       MySwal.fire("Error! ", "Please fill all required fields above.", "error");
//       return;
//     }

//     if (fileList.length === 0) {
//       setFileError(true);
//       return;
//     }

//     const token = getToken();
//     if (!token) {
//       message.error("Token not available. Unable to upload.");
//       return;
//     }

//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append("file", file);
//     });

//     setUploading(true);
//     setFileError(false); // Reset error state

//     axios
//       .post("", formData, {
//         headers: {
//           Authorization: Bearer ${token},
//           "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setProgress(percentCompleted);
//         },
//       })
//       .then((response) => {
//         console.log("Upload response:", response.data);
//         message.success("File uploaded successfully.");
//         setFileList([]); // Clear file list after successful upload
//         setUploadedFiles([...uploadedFiles, fileList[0].name]);
//         setUploadedFileObjects([...uploadedFileObjects, fileList[0]]);
//       })
//       .catch((error) => {
//         console.error("Upload failed:", error);
//         message.error("File upload failed.");
//       })
//       .finally(() => {
//         setUploading(false);
//         setProgress(0);
//       });
//   };

//   const handleRemove = (file) => {
//     const newFileList = fileList.filter((f) => f.uid !== file.uid);
//     setFileList(newFileList);
//   };

//   const props = {
//     name: "file",
//     multiple: false, // Allow only a single file to be selected
//     accept: ".pdf,.doc,.docx",
//     fileList: fileList.map((file) => ({
//       uid: file.uid || Date.now(), // Generate a unique uid if not present
//       name: file.name,
//       status: "done", // Set status to 'done' to show as uploaded in UI
//       icon: <DeleteOutlined onClick={() => handleRemove(file)} />,
//     })),
//     onChange(info) {
//       const { status, originFileObj, uid } = info.file;
//       if (status !== "uploading") {
//         console.log(info.file, info.fileList);
//       }

//       // Check if fileList is not empty and contains files with uid
//       if (info.fileList.length > 0) {
//         const newFileList = info.fileList.slice(-1); // Keep only the last file
//         setFileList(newFileList.map((file) => file.originFileObj));
//       }
//     },
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//     beforeUpload(file) {
//       if (fileList.length > 0) {
//         message.error("You can only upload one file.");
//         return Upload.LIST_IGNORE;
//       }

//       const isPdfOrDoc = file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//       const isLessThan25MB = file.size / 1024 / 1024 < 25;

//       if (!isPdfOrDoc) {
//         message.error(${file.name} is not a supported file format (PDF or DOC/DOCX).);
//         return Upload.LIST_IGNORE;
//       }

//       if (!isLessThan25MB) {
//         message.error(${file.name} exceeds the 25MB file size limit.);
//         return Upload.LIST_IGNORE;
//       }

//       return true;
//     },
//     customRequest({ file, onSuccess }) {
//       // Simulate a successful upload
//       setTimeout(() => {
//         onSuccess("ok");
//       }, 0);
//     },
//     onRemove(file) {
//       handleRemove(file);
//     },
//   };

//   return (
//     <div style={{ padding: "20px", textAlign: "center", borderRadius: "20px" }}>
//       <div style={{ display: "inline-block", width: "100%" }}>
//         <Dragger {...props}>
//           <p className="ant-upload-drag-icon">
//             <InboxOutlined />
//           </p>
//           <p className="ant-upload-text">Click or drag file to this area to upload</p>
//           <p className="ant-upload-hint">Support for a single file upload only.</p>
//           {uploading && <Progress percent={progress} indicating size="small" active />}
//         </Dragger>
//       </div>
//       {fileError && <Alert message="Warning" description="Upload a document first before submitting." type="warning" showIcon style={{ marginTop: 20 }} />}
//       <Button type="primary" onClick={handleUpload} disabled={uploading || fileList.length === 0} loading={uploading} style={{ marginTop: 30 }}>
//         {uploading ? "Uploading" : "Upload"}
//       </Button>
//       {/* {uploadedFiles.length > 0 && (
//         <div className="justify-content-start text-start" style={{ marginTop: 20 }}>
//           <h4>Uploaded Files:</h4>
//           <ul>
//             {uploadedFiles.map((file, index) => (
//               <li key={index}>{file}</li>
//             ))}
//           </ul>
//         </div>
//       )} */}

//       {uploadedFiles.length > 0 && (
//         <List
//           header={<div>Uploaded Files</div>}
//           bordered
//           dataSource={uploadedFiles.map((file) => ({ name: file, file: uploadedFileObjects.find((f) => f.name === file) }))}
//           renderItem={(item) => (
//             <List.Item
//               actions={[
//                 <Tooltip title="Preview" key="preview">
//                   <EyeOutlined onClick={() => window.open(URL.createObjectURL(item.file))} />
//                 </Tooltip>,
//                 <Tooltip title="Download" key="download">
//                   <a href={URL.createObjectURL(item.file)} download={item.name}>
//                     <FileOutlined />
//                   </a>
//                 </Tooltip>,
//               ]}
//             >
//               <List.Item.Meta avatar={<FileOutlined />} title={item.name} description={File size: ${(item.file.size / 1024 / 1024).toFixed(2)} MB} />
//             </List.Item>
//           )}
//           style={{ marginTop: 20 }}
//         />
//       )}
//     </div>
//   );
// };

// export default DropFileInput;

import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";

const { Dragger } = Upload;

const props = {
  name: "file",
  multiple: true,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
  customRequest({ file, onSuccess, onError }) {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("YOUR_API_ENDPOINT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        onSuccess(response.data);
      })
      .catch((error) => {
        onError(error);
      });
  },
};

const App = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag Document to this area to upload</p>
    <p className="ant-upload-hint">Support for a single or many files to upload.</p>
  </Dragger>
);

export default App;