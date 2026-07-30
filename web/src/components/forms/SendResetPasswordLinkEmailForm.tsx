"use client";

import * as z from 'zod';
import { AlertCircleIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert";
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import Link from 'next/link';
import { executeRecaptcha } from '@/lib/recaptcha';

const checkEmailFormSchema = z.object({
  email: z.email("Insira um e-mail valido"),
});

type CheckEmailFormData = z.infer<typeof checkEmailFormSchema>;

export type ApiErrorData = {
  status: string,
  message: string
}

export const SendResetPasswordLinkEmailForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorData>({
    message: "",
    status: ""
  });

  const router = useRouter();

  const form = useForm<CheckEmailFormData>({
    resolver: zodResolver(checkEmailFormSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: CheckEmailFormData) => {
    setIsSubmitting(true);
    setApiError({
      message: "",
      status: ""
    });

    try {
      const token = await executeRecaptcha("send_reset_password_link");

      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-reset-password-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          recaptcha_token: token
        }),
      });

      if (!request.ok) {
        const response = await request.json();

        setApiError(response as ApiErrorData);
        
        return;
      }

      toast.success("Enviamos um link para redefinição da senha no seu e-mail");

      return router.replace("/sign-in");
    } catch (error) {
      console.log(error);
      setApiError({
        status: "ERROR",
        message: error instanceof Error ? error.message : "Houve um erro ao solicitar a nova senha"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="md:m-auto max-w-100 flex-1">
      <CardHeader className='flex items-center justify-center'>
        <CardTitle className="text-2xl">Portfolio CMS</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        {apiError.message != "" && (
          <Alert variant="destructive" className="max-w-md mb-3">
            <AlertCircleIcon />
            <AlertTitle>Mensagem da API</AlertTitle>
            <AlertDescription>
              {apiError.message}
            </AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id='form-check-email'
          className="flex flex-col gap-3"
        >
          <FieldGroup>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="joe@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" form="form-check-email" disabled={isSubmitting}>
          {isSubmitting ? "Checando sua solicitação..." : "Solicitar nova senha"}
        </Button>
        <Link href="/sign-in">
          <Button variant={'link'}>
            Voltar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
