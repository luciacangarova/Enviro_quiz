export const flipCardStyles = {
  parts: ["container", "flipContainer", "visibleSideFront", "visibleSideBack", "hiddenSide"],
  baseStyle: {
    container: {
      perspective: '1000px',
      transformStyle: 'preserve-3d',
      transition: 'transform 1s',
      transform: 'rotateY(360deg)',
    },

    flipContainer:{
      perspective: '1000px',
      transformStyle: 'preserve-3d',
      transition: 'transform 1s',
      transform: 'rotateY(180deg)',
    },

    visibleSideFront:{
      width: '100%',
      height: '100%',
    },

    visibleSideBack:{
      width: '100%',
      height: '100%',
      transform: 'rotateY(180deg)',
    },

    hiddenSide: {
      backfaceVisibility: 'hidden',
      display: 'none',
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
}