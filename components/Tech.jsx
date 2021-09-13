export default function Tech({ head, body }) {
    return (
        <div className="web-tech">
            <h3 className="less-flush web-edge">{head}</h3>
            <p className="flush">{body}</p>
        </div>
    );
};