import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

/* ======================================================
   NAVLINK · IMMERSIVE UI
   - No rompe API
   - Añade profundidad visual
   - Estados perceptivos claros
====================================================== */

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      ...props
    },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            /* ===== BASE ===== */
            "relative inline-flex items-center gap-2",
            "transition-all duration-300 ease-out",
            "outline-none select-none",

            /* ===== INTERACCIÓN ===== */
            "hover:scale-[1.03] active:scale-[0.97]",
            "focus-visible:ring-2 focus-visible:ring-cyan-400/60",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

            /* ===== PROFUNDIDAD ===== */
            "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px",
            "after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
            "hover:after:scale-x-100",

            /* ===== ESTADO ACTIVO ===== */
            isActive && [
              "text-cyan-400",
              "after:scale-x-100 after:bg-cyan-400",
              "drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]",
            ],

            /* ===== ESTADO PENDING ===== */
            isPending && [
              "text-muted-foreground",
              "animate-pulse",
              "after:bg-muted",
            ],

            /* ===== CUSTOM ===== */
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
