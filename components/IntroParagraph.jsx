export default function IntroParagraph({ hello, paragraph }) {
    return (
        <div>
            <p><span id="hello">{hello}</span>{paragraph}</p>
        </div>
    );
};