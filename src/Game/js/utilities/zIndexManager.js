export const zIndexManager = (zIndex, target, strongTarget) => {
  const strongTargetInfo = strongTarget.getColliderInfo();
  const targetInfo = target.getColliderInfo();
  const strongTargetY = strongTargetInfo.coords.y + strongTargetInfo.offset.y + strongTargetInfo.size.h + 0;
  const targetY = targetInfo.coords.y + targetInfo.offset.y + targetInfo.size.h;
  if ( strongTargetY > targetY ) {
    const newIndex = strongTarget.getRenderIndex() - 1;
    target.getRenderIndex() !== newIndex && target.setRenderIndex(newIndex);
  } else {
    target.getRenderIndex() !== zIndex && target.setRenderIndex(zIndex);
  }
};