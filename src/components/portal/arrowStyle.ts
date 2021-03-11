export const arrowStyle = `

    .limel-portal--container[data-popper-placement^='top'] limel-popover-surface {
        margin-bottom: 0.3125rem;
    }
    .limel-portal--container[data-popper-placement^='top'] limel-popover-surface:before {
        bottom: -0.3125rem;
        border-radius: 0.125rem 0;
    }

    .limel-portal--container[data-popper-placement^='right'] limel-popover-surface  {
        margin-left: 0.3125rem;
    }
    .limel-portal--container[data-popper-placement^='right'] limel-popover-surface:before  {
        left: -0.3125rem;
        border-radius: 0 0.125rem;
    }

    .limel-portal--container[data-popper-placement^='bottom'] limel-popover-surface {
        margin-top: 0.3125rem;
    }
    .limel-portal--container[data-popper-placement^='bottom'] limel-popover-surface:before {
        top: -0.3125rem;
        border-radius: 0.125rem 0;
    }

    .limel-portal--container[data-popper-placement^='left'] limel-popover-surface  {
        margin-right: 0.3125rem;
    }
    .limel-portal--container[data-popper-placement^='left'] limel-popover-surface:before  {
        right: -0.3125rem;
        border-radius: 0 0.125rem;
    }





    .limel-portal--container[data-popper-placement='top'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='bottom'] limel-popover-surface:before {
        left: 0;
        right: 0;
    }
    .limel-portal--container[data-popper-placement='top-start'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='bottom-start'] limel-popover-surface:before {
        left: 0.5rem;
    }
    .limel-portal--container[data-popper-placement='top-end'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='bottom-end'] limel-popover-surface:before {
        right: 0.5rem;
    }




    .limel-portal--container[data-popper-placement='right'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='left'] limel-popover-surface:before {
        top: 0;
        bottom: 0;
    }
    .limel-portal--container[data-popper-placement='right-start'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='left-start'] limel-popover-surface:before {
        top: 0.5rem;
    }
    .limel-portal--container[data-popper-placement='right-end'] limel-popover-surface:before,
    .limel-portal--container[data-popper-placement='left-end'] limel-popover-surface:before {
        bottom: 0.5rem;
    }
`;
