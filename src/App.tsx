import {
  Panel,
  PanelHeader,
  Group,
  Spinner,
  Select,
  Div,
  Text,
  View,
  FixedLayout,
  Separator,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import styles from "./App.module.css";
import { CardItem } from "./components/card-item/index";
import { useGetGroupsQuery } from "./utils/api";
import { ChangeEventHandler, useMemo, useState } from "react";

type TTypeGroup = "Все" | "Открытая" | "Закрытая";

export function App() {
  const { data, isLoading } = useGetGroupsQuery();

  const [selectedGroup, setSelectedGroup] = useState<TTypeGroup>("Все");
  const [selectedColor, setSelectedColor] = useState("Любой");
  const [selectedHavingFriends, setSelectedHavingFriends] = useState("Все");

  const groupsType = ["Все", "Открытая", "Закрытая"].map((group) => ({
    label: group,
    value: group,
  }));

  const avatarColor = useMemo(
    () =>
      [
        "Любой",
        ...new Set(
          data
            ?.filter(({ avatar_color }) => avatar_color !== undefined)
            .map(({ avatar_color }) => avatar_color)
            .sort()
        ),
      ].map((color) => ({
        label: color!,
        value: color,
      })),
    [data]
  );

  const friendsInGroups = [
    { label: "Все", value: "Все" },
    { label: "Да", value: "Да" },
    { label: "Нет", value: "Нет" },
  ];

  const groups = useMemo(
    () =>
      data?.filter(({ closed, avatar_color, friends }) => {
        const typeFilter =
          selectedGroup === "Все" ||
          (closed && selectedGroup === "Открытая") ||
          (!closed && selectedGroup === "Закрытая");

        const colorFilter =
          selectedColor === "Любой" || avatar_color === selectedColor;

        const friendsFilter =
          selectedHavingFriends === "Все" ||
          (friends && selectedHavingFriends === "Да") ||
          (!friends && selectedHavingFriends === "Нет");

        return typeFilter && colorFilter && friendsFilter;
      }),
    [selectedGroup, selectedColor, selectedHavingFriends, data]
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
    <View activePanel="fixedLayout">
      <Panel id="fixedLayout">
        <FixedLayout vertical="top" filled>
          <PanelHeader fixed>Группы</PanelHeader>
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
          <Separator wide />
        </FixedLayout>

        <Group>
          {isLoading && (
            <Spinner size="large" aria-busy aria-live="polite">
              Загружается...
            </Spinner>
          )}

          <ul className={styles.list}>
            {groups && groups?.length > 0 ? (
              groups?.map((group) => (
                <li key={group.id}>
                  <CardItem {...group} />
                </li>
              ))
            ) : (
              <Text>Нет подходящих вариантов</Text>
            )}
          </ul>
        </Group>
      </Panel>
    </View>
  );
}
