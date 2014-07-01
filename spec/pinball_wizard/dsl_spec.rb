require 'pinball_wizard'

describe PinballWizard::DSL do

  before(:each) do
    PinballWizard::Registry.clear
  end

  describe '.build' do
    context 'without builder class flags' do
      before(:each) do
        PinballWizard::DSL.build do
          feature :example_a
          feature :example_b, :active
          feature :example_c, active: proc { false }
        end
      end

      it 'adds to the registry' do
        expect(PinballWizard::Registry.to_h).to eq({
          'example_a' => 'inactive',
          'example_b' => 'active',
          'example_c' => 'inactive'
        })
      end

      it 'createa a Feature class instance' do
        expect(PinballWizard::Registry.get('example_a')).to be_a(PinballWizard::Feature)
      end
    end

    context 'with a builder class flag' do

      class MyCustomFeature < PinballWizard::Feature; end

      before(:each) do
        PinballWizard::DSL.build do
          class_patterns my_custom_feature: MyCustomFeature
          feature :example_a, :my_custom_feature
          feature :example_b
        end
      end

      it 'adds to the registry' do
        expect(PinballWizard::Registry.to_h).to eq({
          'example_a' => 'inactive',
          'example_b' => 'inactive'
        })
      end

      it 'createa a custom class instance for the specified' do
        expect(PinballWizard::Registry.get('example_a')).to be_a(MyCustomFeature)
      end

      it 'createa a Feature class instance for the non-specified' do
        expect(PinballWizard::Registry.get('example_b')).to be_a(PinballWizard::Feature)
      end

    end
  end
end
