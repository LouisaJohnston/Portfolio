export default function Tech({ head, body }) {
    return (
        <div>
            <h3 className="less-flush web-edge">{head}</h3>
            <p className="flush">{body}</p>
        </div>
    );
};