import TypingEffect from "./TypingEffect";

function SloganComponent() {
  return (
    <div className="container fs-4">
      <p>Empower your mental health.</p>
      <TypingEffect
        texts={[
          "Access personalized support",
          "Receive instant assistance",
          "Benefit from expert guidance",
        ]}
      />
    </div>
  );
}

export default SloganComponent;
