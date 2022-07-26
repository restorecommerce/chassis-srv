import { ArrayCursor } from 'arangojs/cursor';

export interface TraversalResponse {
  rootCursor?: ArrayCursor;
  associationCursor?: ArrayCursor;
}
