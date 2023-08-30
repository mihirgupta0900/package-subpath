import { Button, Header } from "ui";
import { subtract } from "lib/utils";

export default function Page(): JSX.Element {
  return (
    <>
      <Header text="Web" />
      <Button />
      <div className="">{subtract(2, 2)}</div>
    </>
  );
}
