/**
 * Scroll a child into view horizontally inside a scroll container
 * without moving the page/document (unlike Element.scrollIntoView).
 */
export function scrollChildIntoContainer(
    container: HTMLElement,
    child: HTMLElement,
    behavior: ScrollBehavior = "smooth"
): void {
    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    // Center the child horizontally within the container
    const childCenter =
        childRect.left - containerRect.left + container.scrollLeft + childRect.width / 2;
    const targetLeft = childCenter - container.clientWidth / 2;

    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const nextLeft = Math.max(0, Math.min(targetLeft, maxScroll));

    container.scrollTo({ left: nextLeft, behavior });
}
