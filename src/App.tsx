import {
  SplitLayout,
  SplitCol,
  Panel,
  PanelHeader,
  Group,
  Spinner,
  Select,
  Div,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import styles from "./App.module.css";
import { CardItem } from "./components/card-item/index";
import { useGetGroupsQuery } from "./utils/api";
import { ChangeEventHandler, useState } from "react";

type TTypeGroup = "Все" | "Открытая" | "Закрытая";

export function App() {
  const { data, isLoading } = useGetGroupsQuery();

  const [selectedGroup, setSelectedGroup] = useState<TTypeGroup>("Все");
  const [selectedColor, setSelectedColor] = useState("Все");
  const [selectedHavingFriends, setSelectedHavingFriends] = useState("Все");

  const groupsType = ["Все", "Открытая", "Закрытая"].map((group) => ({
    label: group,
    value: group,
  }));

  const avatarColor = [
    ...new Set(
      data
        ?.filter(({ avatar_color }) => avatar_color !== undefined)
        .map(({ avatar_color }) => avatar_color)
    ),
  ]
    .map((color) => ({
      label: color!,
      value: color,
    }))
    .concat({ label: "Любой", value: "Любой" });

  const friendsInGroups = [
    { label: "Да", value: "Да" },
    { label: "Нет", value: "Нет" },
    { label: "Все", value: "Все" },
  ];

  const filterGroup = (
    typeGroup: TTypeGroup,
    typeColor: string,
    hasFriends: string
  ) => {
    return data?.filter(({ closed, avatar_color, friends }) => {
      const typeFilter =
        typeGroup === "Все" ||
        (closed && typeGroup === "Открытая") ||
        (!closed && typeGroup === "Закрытая");
      const colorFilter = typeColor === "Все" || avatar_color === typeColor;
      const friendsFilter =
        hasFriends === "Все" ||
        (friends && hasFriends === "Да") ||
        (!friends && hasFriends === "Нет");
      return typeFilter && colorFilter && friendsFilter;
    });
  };

  const groups = filterGroup(
    selectedGroup,
    selectedColor,
    selectedHavingFriends
  );

  const handleSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (e.target.name === "private") {
      setSelectedGroup(e.target.value as TTypeGroup);
    } else if (e.target.name === "color") {
      setSelectedColor(e.target.value);
    } else {
      setSelectedHavingFriends(e.target.value);
    }
  };

  return (
    <SplitLayout style={{ justifyContent: "center" }}>
      <SplitCol width={380} maxWidth={380}>
        <Panel>
          <Group className={styles.filter}>
            <Div>
              <label htmlFor="private">По типу приватности</label>
              <Select
                id="private"
                aria-label="По типу приватности"
                placeholder="Не выбран"
                options={groupsType}
                onChange={handleSelect}
                name="private"
              />
            </Div>
            <Div>
              <label htmlFor="color">По цвету аватара</label>
              <Select
                id="color"
                aria-label="По цвету аватара"
                placeholder="Не выбран"
                options={avatarColor}
                onChange={handleSelect}
                name="color"
              />
            </Div>
            <Div>
              <label htmlFor="friendsInGroups">Есть ли друзья в группе</label>
              <Select
                id="friendsInGroups"
                aria-label="Есть ли друзья в группе"
                placeholder="Не выбран"
                options={friendsInGroups}
                onChange={handleSelect}
                name="friendsInGroups"
              />
            </Div>
          </Group>
        </Panel>
      </SplitCol>

      <SplitCol width="100%" stretchedOnMobile autoSpaced>
        {isLoading && (
          <Spinner size="large" aria-busy aria-live="polite">
            Загружается...
          </Spinner>
        )}
        <Panel>
          <PanelHeader>Группы</PanelHeader>
          <Group>
            <ul className={styles.list}>
              {groups?.map((group) => (
                <li key={group.id}>
                  <CardItem {...group} />
                </li>
              ))}
            </ul>
          </Group>
        </Panel>
      </SplitCol>
    </SplitLayout>
  );
}
