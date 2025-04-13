import React from "react";
import { FileText } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Plot from "react-plotly.js";

const textRenderer = (item) => (
    <Markdown remarkPlugins={[remarkGfm]}>
        {item}
    </Markdown>
);

const fileRenderer = (item) => {
    return item.fileName.match(/\.(jpeg|jpg|png|gif)$/i) ? (
        <img
            src={item.file}
            alt={item.fileName}
            style={{
                maxWidth: "30%",
                borderRadius: "5px",
                paddingTop: "10px",
                paddingBottom: "10px",
                width: "250px"
            }}
        />
    ) : (
        <a
            href={item.file}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: "10px" }}
        >
            <FileText size={15} /> View {item.fileName}
        </a>
    );
};

const graphRenderer = (item) => {
    return (
        <Plot
            data={item.props.data}
            layout={item.props.layout}
            config={item.props.config}
            style={item.props.style}
            useResizeHandler
        />
    );
};

const tableRenderer = (item, i) => {
    const {
        columns,
        data,
        striped,
        bordered,
        hover,
        responsive,
        size,
        dark
    } = item.props;

    const classList = ["table"];
    if (striped) {classList.push("table-striped");}
    if (bordered) {classList.push("table-bordered");}
    if (hover) {classList.push("table-hover");}
    if (size === "sm") {
        classList.push("table-sm");
    } else if (size === "lg") {
        classList.push("table-lg");
    } else if (size === "md") {
        classList.push("table-md");
    }
    if (dark) {classList.push("table-dark");}

    const table = (
        <table key={i} className={classList.join(" ")}>
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                            <td key={cIdx}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return responsive ? (
        <div key={i} className="table-responsive">{table}</div>
    ) : table;
};

const renderMessageContent = (content) => {
    if (typeof content === "string") {
        return textRenderer(content);
    }

    if (Array.isArray(content)) {
        return content.map((item, i) => {
            if (typeof item === "string") {
                return (
                    <div key={i}>
                        {textRenderer(item)}
                    </div>
                );
            }

            if (typeof item === "object" && item !== null) {
                switch (item.type) {
                    case "text":
                        return (
                            <div key={i}>
                                {textRenderer(item.text)}
                            </div>
                        );
                    case "attachment":
                        return (
                            <div key={i}>
                                {fileRenderer(item)}
                            </div>
                        );
                    case "graph":
                        return (
                            <div key={i}>
                                {graphRenderer(item)}
                            </div>
                        );
                    case "table":
                        return (
                            <div key={i}>
                                {tableRenderer(item)}
                            </div>
                        );
                    default:
                        return null;
                }
            }
            return null;
        });
    }

    if (typeof content === "object" && content !== null) {
        return renderMessageContent([content]);
    }

    return null;
};

export default renderMessageContent;
