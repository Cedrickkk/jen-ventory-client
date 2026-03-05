import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authQueries, useLogin } from "@/features/auth/queries/use-auth";
import { loginFormSchema } from "@/features/auth/schema/auth";
import type { AppRoutes } from "@/lib/router";
import { useForm } from "@tanstack/react-form";
import {
  createFileRoute,
  isRedirect,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { LoaderCircle, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/")({
  validateSearch: (search) => search as { redirect?: string },
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(
        authQueries.user(),
      );

      if (user?.id) {
        throw redirect({ to: "/dashboard" });
      }

      return null;
    } catch (error) {
      /** Throw redirect and swallow everything else */
      if (isRedirect(error)) {
        throw error;
      }
      /** Allow the page to render */
      return null;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync: loginAsync, error } = useLogin();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await loginAsync(value, {
        onSuccess: async () => {
          await navigate({
            to: search.redirect ?? ("/dashboard" as AppRoutes),
          });
        },
      });
    },
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <ShoppingCart className="size-4" />
            </div>
            JenVentory
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="md:max-w-3xl"
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                  </p>
                </div>
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="Enter your username"
                        />
                        {isInvalid && (
                          <FieldError
                            className="text-xs"
                            errors={field.state.meta.errors}
                          />
                        )}
                        {error && (
                          <p className="text-destructive text-xs">
                            {error?.message}
                          </p>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          type="password"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your password"
                        />
                        {isInvalid && (
                          <FieldError
                            className="text-xs"
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <Field>
                  <Button
                    type="submit"
                    form="login-form"
                    className="flex w-full cursor-pointer items-center justify-center"
                    disabled={form.state.isSubmitting}
                  >
                    {form.state.isSubmitting && (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        <ShoppingCart className="h-48 w-48" />
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          JenVentory
        </h1>
      </div>
    </div>
  );
}
