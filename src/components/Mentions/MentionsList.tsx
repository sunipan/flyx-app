import { User } from '../../lib/types/UserType';
import { capitalizeLabel } from '../../lib/utils/mentionsUtils';

export const MentionsList = ({
  users,
  mentionsText,
  textareaText,
  setMentionsText,
  setTextareaText,
  textRef,
  setPrevMentions,
  prevMentions,
}: {
  users: User[];
  mentionsText: string;
  textareaText: string;
  setMentionsText: (text: string) => void;
  setTextareaText: (text: string) => void;
  textRef: React.RefObject<HTMLTextAreaElement>;
  setPrevMentions: (names: string[]) => void;
  prevMentions: string[];
}) => {
  const handleClickedUser = (user: User) => {
    const textarea = textareaText.split('@')[0] as string;
    const mentions = mentionsText.split('@')[0] as string;
    setMentionsText(
      `${mentions} <span class="${user.label === 'customer' ? 'bg-blue-200' : 'bg-red-200'}">${user.name}</span>`.trim()
    );
    setTextareaText(`${textarea}${user.name}`.trim());
    setPrevMentions([...prevMentions, user.name]);
    textRef.current?.focus();
  };

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <ul className="w-full overflow-hidden rounded-lg">
        {users.map((user: User) => (
          <li
            onClick={() => handleClickedUser(user)}
            className={`${
              user.label === 'customer' ? 'bg-blue-300 hover:bg-blue-400' : 'bg-red-300 hover:bg-red-400'
            } flex cursor-pointer justify-between p-2`}
            key={user.id}
          >
            <div className="ml-2 font-medium">{user.name}</div>
            <div className="mr-2 text-white">{capitalizeLabel(user.label)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
