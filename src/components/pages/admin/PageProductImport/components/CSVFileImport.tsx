import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { toast } from "react-toastify";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL

    const authorization_token = localStorage.getItem("authorization_token");

    axios.interceptors.response.use(
      undefined,
      function axiosRetryInterceptor(err) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });

        console.log(err);
        return Promise.reject(err);
      }
    );

    const response = await axios({
      method: "GET",
      headers: authorization_token
        ? {
            Authorization: `Basic ${authorization_token}`,
          }
        : undefined,
      url,
      params: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: encodeURIComponent(file?.name),
      },
    });
    console.log("File to upload: ", file);
    console.log("Uploading to: ", response.data);

    const result = await fetch(response.data, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
