interface tagProps {
  name: string;
}
export const Tag = ({ name }: tagProps) => {
  return <span className="border"> {name}</span>;
};
