import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/queries/use-auth";
import { loginFormSchema } from "@/features/auth/schema/auth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync: loginAsync, error } = useLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await loginAsync(value);
    },
  });

  return (
    <div className="flex min-h-screen flex-col min-w-4xl">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 w-full">
        <ShoppingCart className="text-secondary-foreground h-20 w-20" />
        <h1 className="text-4xl font-bold tracking-tight">JenVentory</h1>

        <Card className="w-xl space-y-6 rounded-none border-none shadow-none">
          <CardHeader>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-xl font-bold">Login to your account</h1>
              <p className="text-sm text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="md:max-w-3xl"
            >
              <FieldGroup>
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
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="-mt-4">
            <Field orientation="horizontal">
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
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
