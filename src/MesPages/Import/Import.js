import { useState } from "react";
import CSVUploader from "../../Mescomposants/CSVUploader/CsvUploader";

function Import({ param, onSuccess }) {
    const [csvData, setCsvData] = useState([]);

    const handleCsvData = (data) => {
        setCsvData(data);
    };

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="container">
                <div className="bg-blue-light p-5">
                    <div className="">
                        <div
                            className="mb-4"
                            style={{
                                padding: "2.3rem 3rem 3rem 3rem",
                                lineHeight: 1,
                            }}
                        >
                            <CSVUploader
                                data={csvData}
                                onHandlesetData={handleCsvData}
                                params={param}
                                onHandleSuccess={onSuccess}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Import;
