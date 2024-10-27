"use client";
import {
  Box,
  Card,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { PlusIcon } from "@radix-ui/react-icons";

const exercises = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const AddExercise = () => {
  const [checkboxChecked, setCheckboxChecked] = useState(true); // Track checkbox state
  const [numSets, setNumSets] = useState(1); // Default to 1 if empty or checkbox is checked
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Handle changes for the "Antal set..." input field
  const handleSetChange = (e: { target: { value: string } }) => {
    const value = parseInt(e.target.value) || 1; // Default to 1 if empty or invalid
    setNumSets(value);
  };

  // Handle checkbox toggle
  const handleCheckboxClick = () => {
    setCheckboxChecked((prev) => !prev); // Toggle the checkbox state
  };

  // Dynamically calculate the number of fields to display based on conditions
  const renderedFields = checkboxChecked || !numSets ? 1 : numSets;

  return (
    <div>
      <Box maxWidth="400px">
        <Card>
          <Flex direction="column" gap="3" align="baseline">
            <Flex direction="row" gap="3" align="center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[330px] justify-between"
                  >
                    {value
                      ? exercises.find((exercises) => exercises.value === value)
                          ?.label
                      : "Välj övning..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[330px] p-0">
                  <Command>
                    <CommandInput placeholder="Sök övning..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {exercises.map((exercises) => (
                          <CommandItem
                            key={exercises.value}
                            value={exercises.value}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === exercises.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {exercises.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Dialog.Root>
                <Dialog.Trigger>
                  <IconButton
                    className="hover:cursor-pointer"
                    variant="surface"
                  >
                    <PlusIcon width="18" height="18" />
                  </IconButton>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                  <Dialog.Title>Edit profile</Dialog.Title>
                  <Dialog.Description size="2" mb="4">
                    Make changes to your profile.
                  </Dialog.Description>

                  <Flex direction="column" gap="3">
                    <label>
                      <a>Name</a>
                      <TextField.Root
                        defaultValue="Freja Johnsen"
                        placeholder="Enter your full name"
                      />
                    </label>
                    <label>
                      <a>Email</a>
                      <TextField.Root
                        defaultValue="freja@example.com"
                        placeholder="Enter your email"
                      />
                    </label>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button color="gray">Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button>Save</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
            <Flex direction="row" gap="3">
              <label>
                <TextField.Root
                  placeholder="Antal set för övningen"
                  style={{ minWidth: "150px" }}
                  onChange={handleSetChange}
                />
              </label>
              <Flex gap="2" align="center">
                <Checkbox
                  defaultChecked={checkboxChecked}
                  onClick={handleCheckboxClick}
                />
                <a>Samma vikt/antal per set</a>
              </Flex>
            </Flex>

            {/* Render input fields based on computed "renderedFields" */}
            {Array.from({ length: renderedFields }).map((_, index) => (
              <Flex direction="row" align="center" gap="3" key={index}>
                <label>
                  {index === 0 && "Vikt per set (kg)"}
                  <TextField.Root
                    placeholder="Vikt (kg)"
                    style={{ minWidth: "150px" }}
                  />
                </label>
                <label>
                  {index === 0 && "Antal repetitioner per set"}
                  <TextField.Root
                    placeholder="Antal repetitioner"
                    style={{ minWidth: "200px" }}
                  />
                </label>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default AddExercise;
