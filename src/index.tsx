import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const { decimal, hexadecimal, binary, bitsCount, charCode } = useMemo(() => {
    const isDecimal = searchText.match(/^[0-9]+$/);
    const isHexadecimal = searchText.match(/^0x[0-9a-fA-F]+$/);
    const isBinary = searchText.match(/^0b[01]+$/);
    const isText = !isDecimal && !isHexadecimal && !isBinary && searchText.length > 0;
    const result = { decimal: 0, hexadecimal: "0", binary: "0", bitsCount: 0, charCode: "🫥" };

    if (isDecimal) {
      result.decimal = parseInt(searchText, 10);
      result.hexadecimal = result.decimal.toString(16);
      result.binary = result.decimal.toString(2);
    } else if (isHexadecimal) {
      result.hexadecimal = searchText.slice(2);
      result.decimal = parseInt(result.hexadecimal, 16);
      result.binary = result.decimal.toString(2);
    } else if (isBinary) {
      result.binary = searchText.slice(2);
      result.decimal = parseInt(result.binary, 2);
      result.hexadecimal = result.decimal.toString(16);
    } else if (isText) {
      result.hexadecimal = searchText
        .split("")
        .map((char) => char.charCodeAt(0).toString(16))
        .join("");
      result.decimal = parseInt(result.hexadecimal, 16);
      result.binary = result.decimal.toString(2);
    }

    if (result.hexadecimal) {
      result.charCode =
        result.hexadecimal
          .match(/.{1,2}/g)
          ?.map((hex) => String.fromCharCode(parseInt(hex, 16)))
          .join("") || "🫥";
    }

    if (result.binary) {
      result.bitsCount = result.binary.length;
    }

    return result;
  }, [searchText]);

  return (
    <List searchText={searchText} onSearchTextChange={(value) => setSearchText(value)}>
      <List.Item
        icon={{
          source: "decimal-icon.png",
          tintColor: { light: "white", dark: "white" },
        }}
        title={decimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_")}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.CopyToClipboard title="Copier" content={decimal.toString()} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: "hex-icon.webp",
          tintColor: { light: "white", dark: "white" },
        }}
        title={
          "0x" +
            hexadecimal
              .padStart(Math.ceil(hexadecimal.length / 2) * 2, "0")
              .match(/.{1,2}/g)
              ?.reverse()
              .join("_")
              .toUpperCase() || ""
        }
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.CopyToClipboard title="Copy" content={"0x" + hexadecimal} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
      <List.Item
        icon={{
          source: "binary-icon.png",
          tintColor: { light: "white", dark: "white" },
        }}
        title={
          "0b" +
            binary
              .padStart(Math.ceil(binary.length / 4) * 4, "0")
              .match(/.{1,4}/g)
              ?.reverse()
              .join("_") || ""
        }
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.CopyToClipboard title="Copy" content={"0b" + binary} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
      <List.Item
        icon={{ source: Icon.Code, tintColor: { light: "white", dark: "white" } }}
        title={"Nombre de bits : " + bitsCount}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.CopyToClipboard title="Copy" content={bitsCount.toString()} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
      <List.Item
        icon={{ source: Icon.TextInput, tintColor: { light: "white", dark: "white" } }}
        title={"CharCode : " + charCode}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.CopyToClipboard title="Copy" content={charCode} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    </List>
  );
}
