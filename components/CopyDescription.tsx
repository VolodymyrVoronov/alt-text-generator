import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Fragment } from "react";

import { Button } from "./ui/button";

interface ICopyDescriptionProps {
  line: string;
  loading: boolean;
}

const CopyDescription = ({ line, loading }: ICopyDescriptionProps) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const onClick = (): void => {
    copyToClipboard(line.replace(/\d+\./, ""));
  };

  return (
    <Fragment>
      <Button onClick={onClick} size="sm" variant="outline" disabled={loading}>
        {copiedText === line.replace(/\d+\./, "") ? "Copied" : "Copy"}
      </Button>

      <p>{line}</p>
    </Fragment>
  );
};

export default CopyDescription;
