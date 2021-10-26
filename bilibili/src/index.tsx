import {
  ActionPanel,
  CopyToClipboardAction,
  getPreferenceValues,
  List,
  OpenInBrowserAction,
  showToast,
  ToastStyle,
  Icon,
  Color
} from "@raycast/api";
import { useState, useEffect } from "react";
import fetch from "node-fetch";

export default function UserList() {
  const [state, setState] = useState<{ users: User[] }>({ users: [] });

  useEffect(() => {
    async function fetch() {
      const users = await fetchUsers();
      setState((oldState) => ({
        ...oldState,
        users,
      }));
    }
    fetch();
  }, []);

  return (
    <List isLoading={state.users.length === 0} searchBarPlaceholder="Filter user by name...">
      {state.users.map((user =>
        <UserListItem key={user.user_profile.info.uid} user={user} />
      ))}
    </List>
  );
}

function UserListItem(props: { user: User }) {
  const user = props.user;

  return (
    <List.Item
      key={user.user_profile.info.uid}
      title={user.user_profile.info.uname}
      icon={user.user_profile.info.face}
      accessoryIcon={user.has_update === 1 ? { source: Icon.Circle, tintColor:  Color.Green } : undefined }
      actions={
        <ActionPanel>
          <OpenInBrowserAction url={`https://space.bilibili.com/${user.user_profile.info.uid}/video`} />
        </ActionPanel>
      }
    />
  );
}

async function fetchUsers(): Promise<User[]> {
  const preference = getPreferenceValues();

  try {
    const response = await fetch(
      "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_dyn_uplist?teenagers_mode=0",
      {
        headers: {
          cookie: `SESSDATA=${preference.SESSDATA}`,
        },
      }
    );
    const json = await response.json();
    return (json as any).data.items as User[];
  } catch (error) {
    console.error(error);
    showToast(ToastStyle.Failure, "Could not load users");
    return Promise.resolve([]);
  }
}

type User = {
  user_profile: {
    info: {
      uid: number;
      uname: string;
      face: string;
    };
  };
  has_update: 0 | 1;
  is_reserve_recall: boolean;
};
