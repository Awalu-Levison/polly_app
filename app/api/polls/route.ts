import { NextRequest, NextResponse } from 'next/server';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Please select the programming language you enjoy working with the most.',
    options: [
      { id: '1', text: 'JavaScript', votes: 42 },
      { id: '2', text: 'Python', votes: 35 },
      { id: '3', text: 'TypeScript', votes: 28 },
      { id: '4', text: 'Java', votes: 15 },
      { id: '5', text: 'C#', votes: 20 },
    ],
    createdAt: new Date('2023-05-15').toISOString(),
    createdBy: 'user1',
  },
  {
    id: '2',
    title: 'Which frontend framework do you prefer?',
    description: 'Vote for your favorite frontend framework or library.',
    options: [
      { id: '1', text: 'React', votes: 55 },
      { id: '2', text: 'Vue', votes: 30 },
      { id: '3', text: 'Angular', votes: 25 },
      { id: '4', text: 'Svelte', votes: 15 },
    ],
    createdAt: new Date('2023-06-20').toISOString(),
    createdBy: 'user2',
  },
  {
    id: '3',
    title: 'How do you prefer to style your web applications?',
    description: 'Select your preferred styling approach for web development.',
    options: [
      { id: '1', text: 'Tailwind CSS', votes: 48 },
      { id: '2', text: 'CSS Modules', votes: 22 },
      { id: '3', text: 'Styled Components', votes: 35 },
      { id: '4', text: 'SASS/SCSS', votes: 30 },
      { id: '5', text: 'Plain CSS', votes: 15 },
    ],
    createdAt: new Date('2023-07-10').toISOString(),
    createdBy: 'user1',
  },
];

// GET handler for fetching all polls
export async function GET(request: NextRequest) {
  // In a real application, you would fetch polls from a database
  // For this placeholder, we'll return the mock data
  
  // Simulate a slight delay to mimic a database call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({ polls: mockPolls });
}

// POST handler for creating a new poll
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.title || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least two options are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would save the poll to a database
    // For this placeholder, we'll just return a success response with a mock ID
    
    // Simulate a slight delay to mimic a database call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPoll = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      options: body.options.map((option: string, index: number) => ({
        id: (index + 1).toString(),
        text: option,
        votes: 0,
      })),
      createdAt: new Date().toISOString(),
      createdBy: 'currentUser', // In a real app, this would be the authenticated user's ID
    };
    
    return NextResponse.json({ poll: newPoll }, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}