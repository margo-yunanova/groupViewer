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
import { useMemo, useState } from "react";

type TTypeGroup = "Все" | "Открытая" | "Закрытая";

export function App() {
  const { data, isLoading, isError } = useGetGroupsQuery();

  const [selectedGroup, setSelectedGroup] = useState<TTypeGroup>("Все");
  const [selectedColor, setSelectedColor] = useState("Любой");
  const [selectedHavingFriends, setSelectedHavingFriends] = useState("Неважно");

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
    { label: "Неважно", value: "Неважно" },
    { label: "Да", value: "Да" },
    { label: "Нет", value: "Нет" },
  ];

  const groups = useMemo(
    () =>
      data?.filter(({ closed, avatar_color, friends }) => {
        const typeFilter =
          selectedGroup === "Все" ||
          (selectedGroup === "Открытая" && closed) ||
          (selectedGroup === "Закрытая" && !closed);

        const colorFilter =
          selectedColor === "Любой" || avatar_color === selectedColor;

        const friendsFilter =
          selectedHavingFriends === "Неважно" ||
          (selectedHavingFriends === "Да" && friends) ||
          (selectedHavingFriends === "Нет" && !friends);

        return typeFilter && colorFilter && friendsFilter;
      }),
    [selectedGroup, selectedColor, selectedHavingFriends, data]
  );

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
                value={selectedGroup}
                options={groupsType}
                onChange={(e) => setSelectedGroup(e.target.value as TTypeGroup)}
                name="private"
              />
            </Div>
            <Div>
              <label htmlFor="color">По цвету аватара</label>
              <Select
                id="color"
                aria-label="По цвету аватара"
                value={selectedColor}
                options={avatarColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                name="color"
              />
            </Div>
            <Div>
              <label htmlFor="friendsInGroups">Есть ли друзья в группе</label>
              <Select
                id="friendsInGroups"
                aria-label="Есть ли друзья в группе"
                value={selectedHavingFriends}
                options={friendsInGroups}
                onChange={(e) => setSelectedHavingFriends(e.target.value)}
                name="friendsInGroups"
              />
            </Div>
          </Group>
          <Separator wide />
        </FixedLayout>

        <Group>
          {isLoading ? (
            <Spinner
              size="large"
              aria-busy
              aria-live="polite"
              className={styles.spinner}
            >
              Загружается...
            </Spinner>
          ) : (
            <ul className={styles.list}>
              {groups && groups?.length > 0 ? (
                groups?.map((group) => (
                  <li key={group.id}>
                    <CardItem {...group} />
                  </li>
                ))
              ) : !isError ? (
                <Text>Нет подходящих вариантов</Text>
              ) : (
                <Text>Не удалось загрузить данные. Обновите страницу</Text>
              )}
            </ul>
          )}
        </Group>
      </Panel>
    </View>
  );
}
