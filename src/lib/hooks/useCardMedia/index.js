import cardMediaStyles from './useCardMedia';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useCardMedia = makeStyles(cardMediaStyles, { name: 'CardMedia' });

export { cardMediaStyles, useCardMedia };

export { default } from './useCardMedia';
