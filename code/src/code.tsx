import { ActionPanel, List, OpenAction } from "@raycast/api";
import { readdirSync } from "fs";
import { homedir } from "os";

const workspacesPath = `${homedir()}/workspaces`;

const files = readdirSync(workspacesPath).filter((file) => !file.startsWith("."));

export default function main() {
  return (
    <List>
      {files.map((file) => {
        const fullPath = `${workspacesPath}/${file}`;
        return (
          <List.Item
            key={file}
            icon={{ fileIcon: fullPath }}
            title={file}
            actions={
              <ActionPanel>
                <OpenAction
                  title="Open in VSCode"
                  application={{
                    name: "Visual Studio Code",
                    path: "/Applications/Visual Studio Code.app",
                  }}
                  target={fullPath}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
