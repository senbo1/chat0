import APIKeyForm from '@/frontend/components/APIKeyForm';
import { Link } from 'react-router';
import { buttonVariants } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import { useModelStore } from '@/frontend/stores/ModelStore';
import * as DropdownMenu from '@/frontend/components/ui/dropdown-menu';
import { useState } from 'react';

export default function Settings() {
  const models = useModelStore((state) => state.models);
  const summaryModel = useModelStore((state) => state.summaryModel);
  const setSummaryModel = useModelStore((state) => state.setSummaryModel);

  // For dropdown open/close state (optional, for accessibility)
  const [open, setOpen] = useState(false);

  return (
    <section className="flex w-full h-full">
      <Link
        to="/chat"
        className={buttonVariants({
          variant: 'default',
          className: 'w-fit fixed top-10 left-40 z-10',
        })}
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Chat
      </Link>
      <div className="flex flex-col items-center justify-center w-full h-full pt-24 pb-44 mx-auto gap-8">
        <APIKeyForm />
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Other Settings</CardTitle>
            <CardDescription>
              Additional preferences for your chat experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium"
                htmlFor="summary-model-dropdown"
              >
                Summary Model
              </label>
              <DropdownMenu.DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenu.DropdownMenuTrigger asChild>
                  <button
                    id="summary-model-dropdown"
                    className="w-full text-left border rounded-md px-3 py-2 bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Select summary model"
                    type="button"
                  >
                    {summaryModel || 'Select a model'}
                  </button>
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent className="w-full min-w-[12rem]">
                  <DropdownMenu.DropdownMenuRadioGroup
                    value={summaryModel}
                    onValueChange={(value) => {
                      setSummaryModel(value);
                      setOpen(false);
                    }}
                  >
                    {models.map((model) => (
                      <DropdownMenu.DropdownMenuRadioItem
                        key={model}
                        value={model}
                      >
                        {model}
                      </DropdownMenu.DropdownMenuRadioItem>
                    ))}
                  </DropdownMenu.DropdownMenuRadioGroup>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>
              <span className="text-xs text-muted-foreground">
                Model used to automatically generate chat titles.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
