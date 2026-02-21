from collections import deque


def bfs_shortest_path(
    adjacency: dict[str, set[str]],
    start: str,
    end: str,
) -> list[str] | None:
    """BFS shortest path. Returns list of region IDs including start and end."""
    if start == end:
        return [start]

    visited = {start}
    queue: deque[tuple[str, list[str]]] = deque([(start, [start])])

    while queue:
        current, path = queue.popleft()
        for neighbor in adjacency.get(current, set()):
            if neighbor == end:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return None


def get_connected_component(start: str, adjacency: dict[str, set[str]]) -> set[str]:
    """Get all regions reachable from start via BFS."""
    visited: set[str] = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            stack.extend(adjacency.get(node, set()) - visited)
    return visited
