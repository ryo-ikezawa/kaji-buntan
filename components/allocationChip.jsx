import { Chip, Button } from "@mui/material"
import { styled } from "@mui/system"

const ListItem = styled("li")(({theme}) => ({margin: theme.spacing(0.5)}))

export default function AllocationChip(props) {
  return (
    <ListItem>
      <Button
        onClick={() => props.repartition(props.person, props.label, props.tabNumber)}
      >
        <Chip label={props.label + ' '}></Chip>
      </Button>
    </ListItem>
  );
}