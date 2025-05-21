import React from "react";
import PropTypes from "prop-types";
import { FileText } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Plot from "react-plotly.js";

const DashStyleGraph = ({
  figure = {},
  config = {},
  style = {},
  className = '',
  animate = false,
  animationOptions = {},
  responsive = true,
  useResizeHandler = false,
  divId,
  ...rest
}) => {
  const { data = [], layout = {}, frames = [] } = figure;
  const finalConfig = { responsive, ...config };

  return (
    <Plot
      data={data}
      layout={layout}
      frames={frames}
      config={finalConfig}
      revision={layout.revision}
      animate={animate}
      animation={animationOptions}
      style={{
        width: useResizeHandler ? '100%' : null,
        height: useResizeHandler ? '100%' : null,
        ...style,
      }}
      className={className}
      divId={divId}
      useResizeHandler={useResizeHandler}
      {...rest}
    />
  );
};

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
    const {
        figure,
        id,
        config,
        style,
        class_name,
        responsive,
        revision,
        animate,
        animation_options
    } = item.props;
    return (
        <DashStyleGraph
            divId={id}
            figure={figure}
            config={config}
            style={style}
            className={class_name}
            animate={animate}
            animationOptions={animation_options}
            responsive={responsive}
            useResizeHandler={responsive ? responsive : false}
            revision={revision}
        />
    );
};

const tableRenderer = (item, i) => {
    const { data, header, props } = item;
    const {
        class_name: className,
        striped,
        bordered,
        borderless,
        hover,
        responsive,
        size,
        dark,
        style,
    } = props;

    const classList = ["table"];
    if (className) {classList.push(className);}
    if (striped) {classList.push("table-striped");}
    if (bordered) {classList.push("table-bordered");}
    if (borderless) {classList.push("table-borderless");}
    if (hover) {classList.push("table-hover");}
    if (size === "sm") {classList.push("table-sm");}
    else if (size === "lg") {classList.push("table-lg");}
    else if (size === "md") {classList.push("table-md");}
    if (dark) {classList.push("table-dark");}

    const table = (
        <table key={i} className={classList.join(" ")} style={style}>
            <thead>
                <tr>
                    {header.map((col, idx) => (
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


DashStyleGraph.propTypes = {
  figure: PropTypes.object,
  config: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  animate: PropTypes.bool,
  animationOptions: PropTypes.object,
  responsive: PropTypes.bool,
  useResizeHandler: PropTypes.bool,
  divId: PropTypes.string,
};

export default renderMessageContent;
