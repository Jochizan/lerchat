import * as React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import styled, { keyframes } from 'styled-components';
import { useLoadItems } from '@libs/useLoadItems';

interface ListProps {
  direction?: 'vertical' | 'horizontal';
}

const ListContainer = styled.div`
  max-height: 500px;
  max-width: 500px;
  overflow: auto;
  background-color: #fafafa;
`;

const List = styled.ul<ListProps>`
  display: ${({ direction }) =>
    direction === 'horizontal' ? 'flex' : 'block'};
  list-style: none;
  font-size: 16px;
  margin: 0;
  padding: 6px;
`;

const ListItem = styled.li`
  background-color: #fafafa;
  border: 1px solid #99b4c0;
  padding: 8px;
  margin: 4px;
`;

const gradientAnimation = keyframes`
  0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const LoadingRoot = styled.div`
  animation: ${gradientAnimation} 2s linear infinite;
  background: linear-gradient(45deg, #298fee, #11c958, #a120bb, #d6612a);
  background-size: 600% 600%;
  color: #fff;
  padding: 8px;
`;

function Loading() {
  return <LoadingRoot>Loading...</LoadingRoot>;
}

function InfiniteListWithReverseVerticalScroll() {
  const { loading, items, hasNextPage, error, loadMore } = useLoadItems();

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '400px 0px 0px 0px'
  });

  const scrollableRootRef = React.useRef<HTMLDivElement | null>(null);
  const lastScrollDistanceToBottomRef = React.useRef<number>();

  const reversedItems = React.useMemo(() => [...items].reverse(), [items]);

  // We keep the scroll position when new items are added etc.
  React.useEffect(() => {
    const scrollableRoot = scrollableRootRef.current;
    const lastScrollDistanceToBottom =
      lastScrollDistanceToBottomRef.current ?? 0;
    if (scrollableRoot) {
      scrollableRoot.scrollTop =
        scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
    }
  }, [reversedItems, rootRef]);

  const rootRefSetter = React.useCallback(
    (node: HTMLDivElement) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef]
  );

  const handleRootScroll = React.useCallback(() => {
    const rootNode = scrollableRootRef.current;
    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
    }
  }, []);

  return (
    <ListContainer ref={rootRefSetter} onScroll={handleRootScroll}>
      <List>
        {hasNextPage && (
          <ListItem ref={infiniteRef}>
            <Loading />
          </ListItem>
        )}
        {reversedItems.map((item) => (
          <ListItem key={item.key}>{item.value}</ListItem>
        ))}
      </List>
    </ListContainer>
  );
}

export default InfiniteListWithReverseVerticalScroll;
