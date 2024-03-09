import { Accordion, Avatar, Card, Div, Title, Text } from "@vkontakte/vkui";
import style from "./cardItem.module.css";
import { FC } from "react";
import { Group, GroupType } from "../../utils/types";

export const CardItem: FC<Group> = ({
  name,
  closed,
  members_count,
  friends,
  avatar_color,
}) => {
  return (
    <Card mode="shadow">
      <Div className={style.card}>
        <Avatar style={{ backgroundColor: avatar_color }} size={100} />
        <div>
          <Div className={style.cell}>
            <Title level="2">{name}</Title>
          </Div>
          <div className={style.description}>
            <div>
              <Div className={style.cell}>
                <Text>Тип группы: </Text>
                <Text weight="1">{GroupType[`${closed}`]}</Text>
              </Div>
              {members_count > 0 && (
                <Div className={style.cell}>
                  <Text>Количество подписчиков:</Text>
                  <Text weight="1">{members_count}</Text>
                </Div>
              )}
            </div>
            <div>
              {friends && (
                <div>
                  <Accordion>
                    <Accordion.Summary>
                      <Text>Количество друзей:</Text>
                      <Text weight="1">{friends.length}</Text>
                    </Accordion.Summary>
                    <ul>
                      <Accordion.Content>
                        {friends.map(({ first_name, last_name }, id) => (
                          <li key={id}>
                            <Text>
                              {first_name} {last_name}
                            </Text>
                          </li>
                        ))}
                      </Accordion.Content>
                    </ul>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </Div>
    </Card>
  );
};
