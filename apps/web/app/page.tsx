import { subtract } from "lib/utils";

export default function Page(): JSX.Element {
  return (
    <>
      <h1>Hello world</h1>
      <div className="">{subtract(2, 2)}</div>
    </>
  );
}
