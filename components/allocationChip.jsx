import { Chip } from "@mui/material"
import { styled } from "@mui/system"

const ListItem = styled("li")(({theme}) => ({margin: theme.spacing(0.5)}))

export default function AllocationChip(props) {
  return (
    <ListItem>
      <Chip 
        label={props.label + ' '}
        onClick={() => props.repartition(props.person, props.label, props.tabNumber)}
      />
    </ListItem>
  );
}